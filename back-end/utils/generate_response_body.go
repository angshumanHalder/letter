package utils

type Response struct {
	Message string
	Success bool
	Data    interface{}
	Errors  []string
}
