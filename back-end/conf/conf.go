package conf

import (
	"log"

	"github.com/spf13/viper"
)

type Configurations struct {
	Server   ServerConfigurations
	Database DatabaseConfigurations
	Token    TokenConfigurations
}

type ServerConfigurations struct {
	Port string
}

type DatabaseConfigurations struct {
	DBName     string
	DBUser     string
	DBPassword string
	DBURI      string
	REDISDB    string
}

type TokenConfigurations struct {
	Secret string
}

var Config *Configurations

// initialise env variables
func ReadConfigVars() {
	viper.SetConfigName("config")
	viper.AddConfigPath("./conf")
	viper.AutomaticEnv()

	viper.SetConfigType("yml")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file %s", err)
	}

	err := viper.Unmarshal(&Config)
	if err != nil {
		log.Fatal("Unable to decode configuration from yml")
	}
}
