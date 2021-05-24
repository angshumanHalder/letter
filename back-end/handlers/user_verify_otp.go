package handlers

import (
	"context"
	"fmt"
	"net/http"

	Schema "github.com/angshumanHalder/letter/back-end/schemas"
	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (u *User) verifyOtp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var otp VerifyOTP

		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()

		err := c.BindJSON(&otp)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		if errs := utils.ValidateInput(&otp); errs != nil {
			c.JSON(http.StatusBadRequest, errs)
			return
		}

		conn := u.Pool.Get()
		val, err := redis.String(conn.Do("GET", otp.Otp))
		if val == "" {
			c.JSON(http.StatusBadRequest, "OTP did not match")
			return
		}

		var user Schema.UserSchema

		upsert := false
		after := options.After
		opt := options.FindOneAndUpdateOptions{
			ReturnDocument: &after,
			Upsert:         &upsert,
		}

		dbResult := collection.FindOneAndUpdate(ctx, bson.M{"phone": val}, bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "verified", Value: true}}}}, &opt)
		if dbResult.Err() != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}

		err = dbResult.Decode(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}

		uId := user.Id.Hex()

		fmt.Println(uId, user)

		token, err := utils.IssueJWTToken(uId)
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, err.Error())
			return
		}

		tokenData := &Schema.TokenSchema{
			Id:    primitive.NewObjectID(),
			Phone: user.Phone,
			Token: token,
		}

		_, err = tokenCollection.InsertOne(ctx, tokenData)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		_, err = conn.Do("DEL", otp.Otp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		response := utils.Response{
			Success: true,
			Data:    token,
		}
		c.JSON(http.StatusOK, response)

	}
}
