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
		log.Println(messages...)
		out, error := json.Marshal(messages)
		if error != nil {
			return
		}
		conn.Do("SET", userId, out)
		conn.Do("EXPIRE", userId, 60*60*24)
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
	conn.Do("EXPIRE", userId, 60*60*24)
	log.Println("Message if present")
	log.Println(messages...)
}
