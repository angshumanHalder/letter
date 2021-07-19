package handlers

import (
	"context"
	"fmt"
	"net/http"

	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (u *User) saveKey() gin.HandlerFunc {
	return func(c *gin.Context) {
		user_id, ok := c.Get("user_id")
		if !ok {
			c.JSON(http.StatusBadRequest, "No username")
			return
		}

		var reqBody PublicKey
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

		upsert := false
		after := options.After
		opt := options.FindOneAndUpdateOptions{
			ReturnDocument: &after,
			Upsert:         &upsert,
		}

		objectId, err := primitive.ObjectIDFromHex(user_id.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}

		dbResult := collection.FindOneAndUpdate(ctx, bson.M{"_id": objectId, "verified": true}, bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "key", Value: reqBody.PublicKey}}}}, &opt)
		if dbResult.Err() != nil {
			fmt.Print(dbResult.Err())
			c.JSON(http.StatusInternalServerError, err.Error())
		}
		response := utils.Response{
			Success: true,
			Message: "public key saved",
		}
		c.JSON(http.StatusOK, response)
	}
}
