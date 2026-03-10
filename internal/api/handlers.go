package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/samjoshuadud/scrapeGo/internal/scraper"
	"github.com/samjoshuadud/scrapeGo/internal/utils"
)

// not yet
func SearchHandler(w http.ResponseWriter, r *http.Request) {

	url := "https://demonicscans.org/lastupdates.php?list=1"
	query := r.URL.Query().Get("q")

	// demonic scan
	html, err := scraper.FetchPage("" + query)
	if err != nil {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	results, err := scraper.ParseTitles(html, url)

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(results)
}

var manhwaCache = utils.NewCache(10 * time.Minute)

func AllManhwasHandler(w http.ResponseWriter, r *http.Request) {

	// check cache first
	data, exists, expired := manhwaCache.Get()

	if exists {
		if expired {
			go scraper.Crawl()
	}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}

	allManhwas, err := scraper.Crawl()

	if err != nil {
		http.Error(w, "Failed to crawl data", http.StatusInternalServerError)
		return
	}

	manhwaCache.Set(allManhwas)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allManhwas)
}

