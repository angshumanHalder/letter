package utils

import (
	"encoding/json"
	"log"

	"github.com/gomodule/redigo/redis"
)

func StoreMessage(pool *redis.Pool, userId string, data interface{}) {
	conn := pool.Get()
	defer conn.Close()

	var messages []interface{}
	val, _ := redis.String(conn.Do("GET", userId))
	if val == "" {
		messages = append(messages, data)
		out, error := json.Marshal(messages)
		if error != nil {
			return
		}
		conn.Do("SET", userId, out)
		return
	}
	b := []byte(val)
	err := json.Unmarshal(b, &messages)
	if err != nil {
		log.Fatal(err)
	}
	messages = append(messages, data)
	out, error := json.Marshal(messages)
	if error != nil {
		return
	}
	conn.Do("SET", userId, out)
	log.Println("Message if present")
	log.Println(messages...)
}
