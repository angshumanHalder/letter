package handlers

import (
	"context"
	"fmt"
	"net/http"

	Schema "github.com/angshumanHalder/letter/back-end/schemas"
	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (u *User) registerHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		var reqBody Register
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()

		err := c.BindJSON(&reqBody)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		if errs := utils.ValidateInput(&reqBody); errs != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		user := Schema.UserSchema{
			Id:       primitive.NewObjectID(),
			Username: reqBody.Username,
			Phone:    reqBody.Phone,
			Verified: false,
		}
		_, err = collection.InsertOne(ctx, user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		otp := utils.GenerateOTP()

		conn := u.Pool.Get()
		defer conn.Close()
		_, err = conn.Do("SET", otp, user.Phone)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		fmt.Println("otp", otp)

		response = utils.Response{
			Success: true,
		}
		c.JSON(http.StatusCreated, response)
	}
}
