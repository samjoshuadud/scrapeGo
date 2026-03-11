package scraper

import (
	"fmt"
	"github.com/samjoshuadud/scrapeGo/internal/models"
)

// ScrapeTitles fetches a single page of titles.
func ScrapeTitles(page int) ([]models.Manhwa, error) {
	url := fmt.Sprintf("https://demonicscans.org/lastupdates.php?list=%d", page)

	// getting the DOM of the page
	html, err := FetchPage(url)
	if err != nil {
		return nil, err
	}

	manhwas, err := ParseTitles(html, url)
	if err != nil {
		return nil, err
	}

	return manhwas, nil
}

func SearchTitles(query string) ([]models.Manhwa, error) {
	url := fmt.Sprintf("https://demonicscans.org/search.php?manga=%s", query)

	html, err := FetchPage(url)
	if err != nil {
		return nil, err
	}

	manhwas, err := ParseSearchResults(html, url)
	if err != nil {
		return nil, err
	}

	return manhwas, nil
}

