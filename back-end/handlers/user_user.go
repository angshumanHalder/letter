package handlers

import (
	"context"
	"net/http"

	Schema "github.com/angshumanHalder/letter/back-end/schemas"
	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (u *User) getUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()

		user_id, ok := c.Get("user_id")
		if !ok {
			c.JSON(http.StatusBadRequest, "No username")
			return
		}

		var user Schema.UserSchema
		if err := collection.FindOne(ctx, bson.M{"user_id": user_id}).Decode(&user); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		response = utils.Response{
			Success: true,
			Data:    user,
		}
		c.JSON(http.StatusOK, response)
	}
}
