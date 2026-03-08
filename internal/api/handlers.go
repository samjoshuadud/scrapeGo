package api

import (
	"encoding/json"
	"net/http"

 "github.com/samjoshuadud/scrapeGo/internal/scraper"
)

// not yet
func SearchHandler(w http.ResponseWriter, r *http.Request) {

	query := r.URL.Query().Get("q")

	// demonic scan
	html, err := scraper.FetchPage("" + query)
	if err != nil {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	results, err := scraper.ParseTitles(html)

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(results)
}


func AllManhwasHandler(w http.ResponseWriter, r *http.Request) {
	
	// logic here is simple it is just for page 1.. there r lots of page but ill think of a strategy later first
	html, err := scraper.FetchPage("https://demonicscans.org/lastupdates.php?list=1")

	if err != nil {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	results, err := scraper.ParseTitles(html)
	
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(results)

}
