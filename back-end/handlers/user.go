package handlers

import (
	"time"

	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/mongo"
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
	Otp string `validate:"required"`
}

type GetUsers struct {
	Phones []string `validate:"required"`
}

type UserContact struct {
	Id       string
	Username string
	Phone    string
}

var collection *mongo.Collection
var tokenCollection *mongo.Collection
var response utils.Response

const timeout = 5 * time.Second

func (u *User) Initialize() {
	const collectionName = "users"
	const tokenCollectionName = "tokens"
	collection = u.DB.Collection(collectionName)
	tokenCollection = u.DB.Collection(tokenCollectionName)
}
