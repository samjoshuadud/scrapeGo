package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/samjoshuadud/scrapeGo/internal/models"
	"github.com/samjoshuadud/scrapeGo/internal/scraper"
	"sync"
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

	if data, ok := manhwaCache.Get(); ok {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}

	var wg sync.WaitGroup
	results := make(chan []models.Manhwa)
	pages := make(chan int)

	workers := 5

	for i := 0; i <= workers; i++ {
		wg.Add(1)

		go func() {
			defer wg.Done()

			for page := range pages {
				url := fmt.Sprintf("https://demonicscans.org/lastupdates.php?list=%d", page)

				html, err := scraper.FetchPage(url)
				if err != nil {
					http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
					return
				}

				manhwas, err := scraper.ParseTitles(html, url)
				if err != nil {
					http.Error(w, "Failed to parse data", http.StatusInternalServerError)
					return
				}

				if len(manhwas) < 20 {
					return
				}

				results <- manhwas
			}

		}()

	}

	go func() {
		for i := 1; ; i++ {
			pages <- i
		}
	}()

	go func() {
		wg.Wait()
		close(results)
	}()

	var allManhwas []models.Manhwa

	for res := range results {
		allManhwas = append(allManhwas, res...)
	}

	manhwaCache.Set(allManhwas)

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(allManhwas)

}
