package Schema

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserSchema struct {
	Id        primitive.ObjectID `bson:"_id"`
	Username  string             `bson:"username, omitempty"`
	Phone     string             `bson:"phone, omitempty"`
	PublicKey string             `bson:"key, omitempty"`
	Verified  bool               `bson:"verified"`
}
