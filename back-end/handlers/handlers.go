package handlers

import (
	"github.com/angshumanHalder/letter/back-end/middlewares"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserHandlers(r *gin.Engine, database *mongo.Database, pool *redis.Pool) {
	user := &User{DB: database, Pool: pool}
	chat := &Chat{pool: pool}
	user.Initialize()
	r.POST("/user", user.registerHandler())
	r.GET("/user", middlewares.AuthMiddleware(), user.getUser())
	r.POST("/user/otp", user.generateOtp())
	r.POST("/user/verify", user.verifyOtp())
	r.POST("/user/contacts", middlewares.AuthMiddleware(), user.getContacts())
	r.POST("/user/save-key", middlewares.AuthMiddleware(), user.saveKey())
	r.GET("/user/ws", middlewares.AuthMiddleware(), chat.InitializeConn())
}
