package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/samjoshuadud/scrapeGo/internal/api"
	"github.com/samjoshuadud/scrapeGo/internal/middleware"
)

func main() {
	// Load .env file if it exists
	godotenv.Load()

	r := mux.NewRouter()

	r.Use(middleware.LoggingMiddleware)

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Manhwa API Running")
	})

	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/search", api.SearchHandler)
	apiRouter.HandleFunc("/manhwas", api.ManhwasHandler)
	apiRouter.HandleFunc("/chapter", api.ChapterPagesHandler)
	apiRouter.HandleFunc("/{slug:manhwa/.*}", api.ManhwaDetailsHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Starting Manhwa API on port: " + port)
	http.ListenAndServe(":"+port, r)
}
