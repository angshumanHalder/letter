package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Chat struct{}

type ChatServer struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte
}

type Client struct {
	conn       *websocket.Conn
	chatServer *ChatServer
	send       chan []byte
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 10000
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

func newClient(conn *websocket.Conn, chatServer *ChatServer) *Client {
	return &Client{
		conn:       conn,
		chatServer: chatServer,
		send:       make(chan []byte, 256),
	}
}

func socketRequestHandler(chatServer *ChatServer, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := newClient(conn, chatServer)

	go client.writePump()
	go client.readPump()
	chatServer.register <- client
}

func (client *Client) readPump() {
	defer func() {
		client.chatServer.unregister <- client
		close(client.send)
		client.conn.Close()
	}()

	client.conn.SetReadLimit(maxMessageSize)
	client.conn.SetReadDeadline(time.Now().Add(pongWait))
	client.conn.SetPongHandler(func(string) error {
		client.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, jsonMessage, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			break
		}
		client.chatServer.broadcast <- jsonMessage
	}
}

func (client *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()
	for {
		select {
		case message, ok := <-client.send:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			n := len(client.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-client.send)
			}
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}

}

func NewChatServer() *ChatServer {
	return &ChatServer{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
	}
}

func (server *ChatServer) Run() {
	for {
		select {
		case client := <-server.register:
			server.registerClient(client)
		case client := <-server.unregister:
			server.unregisterClient(client)
		case message := <-server.broadcast:
			server.broadcastToClients(message)
		}
	}
}

func (server *ChatServer) registerClient(client *Client) {
	server.clients[client] = true
}

func (server *ChatServer) unregisterClient(client *Client) {
	delete(server.clients, client)
}

func (server *ChatServer) broadcastToClients(message []byte) {
	for client := range server.clients {
		client.send <- message
	}
}

func (ch *Chat) InitializeConn() gin.HandlerFunc {
	return func(c *gin.Context) {
		chatServer := NewChatServer()
		go chatServer.Run()
		socketRequestHandler(chatServer, c.Writer, c.Request)
	}
}
