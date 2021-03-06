package handlers

import (
	"context"
	"net/http"

	Schema "github.com/angshumanHalder/letter/back-end/schemas"
	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (u *User) getContacts() gin.HandlerFunc {
	return func(c *gin.Context) {
		var phones GetUsers
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()

		err := c.BindJSON(&phones)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		if errs := utils.ValidateInput(&phones); errs != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		var users []Schema.UserSchema

		query := bson.M{"phone": bson.M{"$in": phones.Phones}, "verified": true}

		cur, err := collection.Find(ctx, query)

		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		err = cur.All(ctx, &users)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		var contacts []UserContact
		for i := range users {
			user := UserContact{
				Id:        users[i].Id.Hex(),
				Username:  users[i].Username,
				Phone:     users[i].Phone,
				PublicKey: users[i].PublicKey,
			}
			contacts = append(contacts, user)
		}

		response := utils.Response{
			Success: true,
			Message: "Contacts",
			Data:    contacts,
		}

		c.JSON(http.StatusOK, response)

		defer cur.Close(ctx)
	}
}
