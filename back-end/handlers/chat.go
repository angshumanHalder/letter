package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/gorilla/websocket"
)

type Chat struct {
	pool *redis.Pool
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

func socketRequestHandler(hub *Hub, user_id string, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	createNewSocketUser(hub, conn, user_id)
}

func (ch *Chat) InitializeConn() gin.HandlerFunc {
	hub := NewHub(ch.pool)
	go hub.Run()
	return func(c *gin.Context) {
		user_id, ok := c.Get("user_id")
		if !ok {
			c.JSON(http.StatusBadRequest, "No username")
			return
		}
		socketRequestHandler(hub, user_id.(string), c.Writer, c.Request)
	}
}
