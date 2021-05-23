package handlers

import (
	"context"
	"net/http"

	Schema "github.com/angshumanHalder/letter/back-end/schemas"
	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (u *User) generateOtp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var phone GenOtp
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()

		err := c.BindJSON(&phone)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		if errs := utils.ValidateInput(&phone); errs != nil {
			c.JSON(http.StatusBadRequest, errs)
			return
		}

		var user Schema.UserSchema
		if err := collection.FindOne(ctx, bson.M{"phone": phone.Phone}).Decode(&user); err != nil {
			response = utils.Response{
				Success: true,
				Errors:  []string{err.Error()},
			}
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		otp := utils.GenerateOTP()

		conn := u.Pool.Get()
		defer conn.Close()
		_, err = conn.Do("SET", otp, user.Phone)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}

		response = utils.Response{
			Success: true,
		}

		c.JSON(http.StatusOK, response)
	}
}
