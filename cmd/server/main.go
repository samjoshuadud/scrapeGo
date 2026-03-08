package main

import (
	"fmt"
	"net/http"

	"github.com/samjoshuadud/scrapeGo/internal/api"
)


func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Manhwa API Running")
	})

	http.HandleFunc("/search", api.SearchHandler)
	http.HandleFunc("/manhwas", api.AllManhwasHandler)

	fmt.Println("Starting Manhwa API on port 8080...")
	http.ListenAndServe(":8080", nil)

}
