module github.com/angshumanHalder/letter/back-end

go 1.16

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gin-contrib/cors v1.3.1
	github.com/gin-gonic/gin v1.7.1
	github.com/go-playground/locales v0.13.0
	github.com/go-playground/universal-translator v0.17.0
	github.com/go-playground/validator/v10 v10.6.0
	github.com/gomodule/redigo v1.8.4
	github.com/gorilla/websocket v1.4.2
	github.com/spf13/viper v1.7.1
	go.mongodb.org/mongo-driver v1.5.2
)

replace github.com/angshumanHalder/letter/back-end/conf v0.0.0 => ./conf

replace github.com/angshumanHalder/letter/back-end/handlers v0.0.0 => ./handlers

replace github.com/angshumanHalder/letter/back-end/schemas v0.0.0 => ./schemas

replace github.com/angshumanHalder/letter/back-end/utils v0.0.0 => ./utils
