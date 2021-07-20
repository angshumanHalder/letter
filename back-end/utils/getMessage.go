package utils

import (
	"encoding/json"
	"log"

	"github.com/gomodule/redigo/redis"
)

func GetMessage(pool *redis.Pool, userId string) []interface{} {
	conn := pool.Get()
	defer conn.Close()

	var messages []interface{}
	val, _ := redis.String(conn.Do("GET", userId))
	if val == "" {
		return nil
	}
	b := []byte(val)
	err := json.Unmarshal(b, &messages)
	if err != nil {
		log.Fatal(err)
	}
	conn.Do("DEL", userId)
	return messages
}
