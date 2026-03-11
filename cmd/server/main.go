package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/samjoshuadud/scrapeGo/internal/api"
	"github.com/samjoshuadud/scrapeGo/internal/middleware"
	"os"

)

func main() {
	r := mux.NewRouter()

	r.Use(middleware.LoggingMiddleware)

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Manhwa API Running")
	})

	r.HandleFunc("/search", api.SearchHandler)
	r.HandleFunc("/manhwas", api.ManhwasHandler)
	r.HandleFunc("/chapter", api.ChapterPagesHandler)
	r.HandleFunc("/{slug:manhwa/.*}", api.ManhwaDetailsHandler)


	// env variable for port would be better for production, but hardcoding for simplicity

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Starting Manhwa API on port: "+port)

	http.ListenAndServe(":"+port, r)
}
