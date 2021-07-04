package middlewares

import (
	"net/http"

	utils "github.com/angshumanHalder/letter/back-end/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := utils.TokenValid(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "You need to be authorized to access this route")
			c.Abort()
			return
		}
		c.Set("user_id", claims["user_id"].(string))
		c.Next()
	}

}
