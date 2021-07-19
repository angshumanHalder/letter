package handlers

import (
	"github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gomodule/redigo/redis"
)

type Hub struct {
	clients    map[string]*Client
	register   chan *Client
	unregister chan *Client
	pool       *redis.Pool
}

func NewHub(pool *redis.Pool) *Hub {
	return &Hub{
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]*Client),
		pool:       pool,
	}
}

func (hub *Hub) Run() {
	for {
		select {
		case client := <-hub.register:
			HandleUserRegisterEvent(hub, client)
		case client := <-hub.unregister:
			HandleUserDisconnectEvent(hub, client)
		}
	}
}

func HandleUserRegisterEvent(hub *Hub, client *Client) {
	hub.clients[client.userId] = client
}

func HandleUserDisconnectEvent(hub *Hub, client *Client) {
	_, ok := hub.clients[client.userId]
	if ok {
		delete(hub.clients, client.userId)
		close(client.send)
	}
}

func EmitToSpecificClient(hub *Hub, payload SocketEventStruct, userId string) {
	client, found := hub.clients[userId]
	if !found {
		utils.StoreMessage(hub.pool, userId, payload.EventPayload)
		return
	}
	client.send <- payload

	// for client := range hub.clients {
	// 	if client.userId == userId {
	// 		select {
	// 		case client.send <- payload:
	// 		default:
	// 			close(client.send)
	// 			delete(hub.clients, client)
	// 		}
	// 	}
	// }
}

func handleSocketPayloadEvents(client *Client, socketEventPayload SocketEventStruct) {
	var socketEventReponse SocketEventStruct
	selectedUserId := socketEventPayload.EventPayload.(map[string]interface{})["to"].(string)
	socketEventReponse.EventName = "message response"
	socketEventReponse.EventPayload = map[string]interface{}{
		"to":      selectedUserId,
		"message": socketEventPayload.EventPayload.(map[string]interface{})["message"],
	}
	EmitToSpecificClient(client.hub, socketEventReponse, selectedUserId)
}
