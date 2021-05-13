package main

import (
	"context"
	"log"
	"sync"
	"time"

	conf "github.com/angshumanHalder/letter/back-end/conf"
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDataStore struct {
	db     *mongo.Database
	client *mongo.Client
}

func CreateMongoDataStore() *MongoDataStore {
	var mongoDatastore *MongoDataStore
	db, client := connect()
	if db == nil || client == nil {
		log.Fatal("Failed to connect")
		return nil
	}
	mongoDatastore = new(MongoDataStore)
	mongoDatastore.db = db
	mongoDatastore.client = client
	return mongoDatastore
}

func connect() (a *mongo.Database, b *mongo.Client) {

	var connectOnce sync.Once
	var db *mongo.Database
	var client *mongo.Client
	connectOnce.Do(func() {
		db, client = connectToMongo()
	})
	return db, client
}

func connectToMongo() (a *mongo.Database, b *mongo.Client) {
	var err error
	client, err := mongo.NewClient(options.Client().ApplyURI(conf.Config.Database.DBURI))
	if err != nil {
		log.Fatal(err)
	}
	client.Connect(context.TODO())

	if err != nil {
		log.Fatal(err)
	}
	database := client.Database(conf.Config.Database.DBName)
	log.Printf("CONNECTED, %v", conf.Config.Database.DBName)

	return database, client
}

func CreateRedisStore() *redis.Pool {
	return &redis.Pool{
		MaxIdle:     10,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", conf.Config.Database.REDISDB)
		},
	}
}
