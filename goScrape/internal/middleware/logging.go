package middleware


import (
	"fmt"
	"net/http"

)


func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("%s %s %s \n", r.RemoteAddr, r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}
