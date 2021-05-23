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

		username := c.Param("username")
		if username == "" {
			c.JSON(http.StatusBadRequest, "No username")
			return
		}

		var user Schema.UserSchema
		if err := collection.FindOne(ctx, bson.M{"username": username}).Decode(&user); err != nil {
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
