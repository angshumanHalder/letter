package utils

import (
	conf "github.com/angshumanHalder/letter/back-end/conf"
	jwt "github.com/dgrijalva/jwt-go"
)

func IssueJWTToken(userId string) (string, error) {
	var err error
	secret := conf.Config.Token.Secret
	atClaims := jwt.MapClaims{}

	atClaims["authorized"] = true
	atClaims["user_id"] = userId
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return token, nil
}
