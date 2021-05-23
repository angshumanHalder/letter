package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserHandlers(r *gin.Engine, database *mongo.Database, pool *redis.Pool) {
	user := &User{DB: database, Pool: pool}
	user.Initialize()
	r.POST("/user", user.registerHandler())
	r.GET("/user/:username", user.getUser())
	r.POST("/user/otp", user.generateOtp())
	r.POST("/user/verify", user.verifyOtp())
}
