package main

import (
	"fmt"
	"net/http"
	"github.com/gorilla/mux"

	"github.com/samjoshuadud/scrapeGo/internal/api"
	"github.com/samjoshuadud/scrapeGo/internal/middleware"
)


func main() {

	r := mux.NewRouter()

	r.Use(middleware.LoggingMiddleware)
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Manhwa API Running")
	})



	r.HandleFunc("/search", api.SearchHandler)
	r.HandleFunc("/manhwas", api.AllManhwasHandler)

	fmt.Println("Starting Manhwa API on port 8080...")
	http.ListenAndServe(":8080", r)

}
