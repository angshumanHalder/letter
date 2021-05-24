package main

import (
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/mongo"

	conf "github.com/angshumanHalder/letter/back-end/conf"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	RouteHandlers "github.com/angshumanHalder/letter/back-end/handlers"
)

var Db *mongo.Database
var pool *redis.Pool

func main() {
	conf.ReadConfigVars()
	// db setup
	dataStore := CreateMongoDataStore()
	Db = dataStore.db

	pool = CreateRedisStore()
	// declare a router
	router := newRouter()
	router.Run(conf.Config.Server.Port)
}

func newRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())
	RouteHandlers.UserHandlers(r, Db, pool)
	return r
}
