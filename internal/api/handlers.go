package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/samjoshuadud/scrapeGo/internal/scraper"
	"github.com/samjoshuadud/scrapeGo/internal/utils"
)

var (
	// Cache items expire after 15 minutes
	ManhwaCache = utils.NewCache(15 * time.Minute)
)

func ManhwaDetailsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]
	if slug == "" {
		http.Error(w, "Slug is required", http.StatusBadRequest)
		return
	}

	// we translate the slug back for the scraper
	siteSlug := strings.Replace(slug, "manhwa/", "manga/", 1)

	details, err := scraper.ScrapeManhwaDetails(siteSlug)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to fetch manhwa details: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(details)
}

// SearchHandler is still a work in progress
func SearchHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	results, err := scraper.SearchTitles(query)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to search titles: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func ChapterPagesHandler(w http.ResponseWriter, r *http.Request) {
	mangaID := r.URL.Query().Get("manga")
	chapterNum := r.URL.Query().Get("chapter")

	var slug string

	// Primary: use manga and chapter as separate clean params
	// e.g. /chapter?manga=6&chapter=200.5
	if mangaID != "" && chapterNum != "" {
		slug = fmt.Sprintf("/chaptered.php?manga=%s&chapter=%s", mangaID, chapterNum)
	}

	// Fallback: use slug param (must be URL-encoded by the client)
	if slug == "" {
		slug = r.URL.Query().Get("slug")
	}

	if slug == "" {
		http.Error(w, "Query parameters 'manga' and 'chapter' are required", http.StatusBadRequest)
		return
	}

	pages, err := scraper.ScrapeChapterPages(slug)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to fetch chapter pages: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pages)
}

func ManhwasHandler(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	ManhwaCache.LogState()

	// Check cache first, if it exists and is not expired, return it immediately 
	data, exists, expired := ManhwaCache.Get(page)
	if exists && !expired {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}

	// If it doesn't exist OR it's expired, scrape and cache it
	data, err = scraper.ScrapeTitles(page)
	if err != nil {
		// If scrape fails but we have stale data, return the stale data as a fallback
		if exists {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		http.Error(w, "Failed to fetch page", http.StatusInternalServerError)
		return
	}

	// Update the cache
	ManhwaCache.Set(page, data)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
