package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	Schema "github.com/angshumanHalder/letter/back-end/schemas"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"

	utils "github.com/angshumanHalder/letter/back-end/utils"
)

type User struct {
	DB   *mongo.Database
	Pool *redis.Pool
}

type Register struct {
	Username string `validate:"required"`
	Phone    string `validate:"required"`
}

type GenOtp struct {
	Phone string `validate:"required"`
}

type VerifyOTP struct {
	Otp   string `validate:"required"`
	Phone string `validate:"required"`
}

var collection *mongo.Collection
var response utils.Response

const timeout = 5 * time.Second

func (u *User) Initialize() {
	const collectionName = "users"
	collection = u.DB.Collection(collectionName)
}

func (u *User) registerHandler(c *gin.Context) {
	var reqBody Register
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	err := c.BindJSON(&reqBody)
	if err != nil {
		response = utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	if errs := utils.ValidateInput(&reqBody); errs != nil {
		response = utils.Response{
			Success: false,
			Errors:  errs,
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	user := Schema.UserSchema{
		Id:       primitive.NewObjectID(),
		Username: reqBody.Username,
		Phone:    reqBody.Phone,
	}
	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		response = utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusInternalServerError, response)
		return
	}

	response = utils.Response{
		Success: true,
	}
	c.JSON(http.StatusCreated, response)
}

// TODO: use parse jwt token from middle ware to get logged in user details
func (u *User) meHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	username := c.Param("username")
	if username == "" {
		response = utils.Response{
			Success: false,
			Errors:  []string{"No username provided"},
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	var user Schema.UserSchema
	if err := collection.FindOne(ctx, bson.M{"username": username}).Decode(&user); err != nil {
		response = utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusInternalServerError, response)
		return
	}

	response = utils.Response{
		Success: true,
		Data:    user,
	}
	c.JSON(http.StatusOK, response)
}

func (u *User) generateOtp(c *gin.Context) {
	var phone GenOtp
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	err := c.BindJSON(&phone)
	if err != nil {
		response := utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	if errs := utils.ValidateInput(&phone); errs != nil {
		response = utils.Response{
			Success: false,
			Errors:  errs,
		}
		c.JSON(http.StatusBadRequest, response)
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
	_, err = conn.Do("SET", user.Username, otp)
	if err != nil {
		response = utils.Response{
			Success: true,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusInternalServerError, err.Error())
	}

	response = utils.Response{
		Success: true,
	}

	c.JSON(http.StatusOK, response)
}

func (u *User) verifyOtp(c *gin.Context) {
	var otp VerifyOTP

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	err := c.BindJSON(&otp)
	if err != nil {
		response := utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	if errs := utils.ValidateInput(&otp); errs != nil {
		response := utils.Response{
			Success: false,
			Errors:  errs,
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	conn := u.Pool.Get()
	val, err := redis.String(conn.Do("GET", otp.Phone))
	if val != otp.Otp {
		err = errors.New("OTP did not match")
		response := utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	val1, err := conn.Do("DEL", otp.Phone)
	fmt.Println(val1)
	if err != nil {
		return
	}

	var user Schema.UserSchema
	if err := collection.FindOne(ctx, bson.M{"phone": otp.Phone}).Decode(&user); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	uId := user.Id.Hex()

	token, err := utils.IssueJWTToken(uId)
	if err != nil {
		response := utils.Response{
			Success: false,
			Errors:  []string{err.Error()},
		}
		c.JSON(http.StatusUnprocessableEntity, response)
		return
	}

	response := utils.Response{
		Success: true,
		Data:    token,
	}
	c.JSON(http.StatusOK, response)
}
