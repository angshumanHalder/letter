package handlers

type Hub struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
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
	hub.clients[client] = true
}

func HandleUserDisconnectEvent(hub *Hub, client *Client) {
	_, ok := hub.clients[client]
	if ok {
		delete(hub.clients, client)
		close(client.send)
	}
}

func EmitToSpecificClient(hub *Hub, payload SocketEventStruct, userId string) {
	for client := range hub.clients {
		if client.userId == userId {
			select {
			case client.send <- payload:
			default:
				close(client.send)
				delete(hub.clients, client)
			}
		}
	}
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
