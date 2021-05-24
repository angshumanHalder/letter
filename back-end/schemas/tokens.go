package Schema

import "go.mongodb.org/mongo-driver/bson/primitive"

type TokenSchema struct {
	Id    primitive.ObjectID `bson:"_id"`
	Phone string             `bson:"phone, omitempty"`
	Token string             `bson:"token"`
}
