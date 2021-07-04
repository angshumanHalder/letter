package handlers

import (
	"bytes"
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	hub        *Hub
	connection *websocket.Conn
	send       chan SocketEventStruct
	userId     string
}

type SocketEventStruct struct {
	EventName    string      `json:"eventName"`
	EventPayload interface{} `json:"eventPayload"`
}

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 10000
)

func createNewSocketUser(hub *Hub, connection *websocket.Conn, userId string) {
	client := &Client{
		hub:        hub,
		connection: connection,
		send:       make(chan SocketEventStruct),
		userId:     userId,
	}

	go client.writePump()
	go client.readPump()

	client.hub.register <- client
}

func (client *Client) readPump() {
	var socketEventPayload SocketEventStruct

	defer unRegisterAndCloseConnection(client)

	setSocketPayloadReadConfig(client)

	for {
		_, payload, err := client.connection.ReadMessage()
		decoder := json.NewDecoder(bytes.NewReader(payload))
		decodeErr := decoder.Decode(&socketEventPayload)

		if decodeErr != nil {
			log.Printf("error: %v", decodeErr)
			break
		}

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {

				log.Printf("error --> : %v", err)
			}
			break
		}
		handleSocketPayloadEvents(client, socketEventPayload)
	}
}

func (client *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.connection.Close()
	}()
	for {
		select {
		case payload, ok := <-client.send:
			reqBodyBytes := new(bytes.Buffer)
			json.NewEncoder(reqBodyBytes).Encode(payload)
			finalPayload := reqBodyBytes.Bytes()

			client.connection.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				client.connection.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.connection.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(finalPayload)

			n := len(client.send)
			for i := 0; i < n; i++ {
				json.NewEncoder(reqBodyBytes).Encode(<-client.send)
				w.Write(reqBodyBytes.Bytes())
			}
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			client.connection.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.connection.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func setSocketPayloadReadConfig(client *Client) {
	client.connection.SetReadLimit(maxMessageSize)
	client.connection.SetReadDeadline(time.Now().Add(pongWait))
	client.connection.SetPongHandler(func(string) error {
		client.connection.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
}

func unRegisterAndCloseConnection(client *Client) {
	client.hub.unregister <- client
	client.connection.Close()
}
