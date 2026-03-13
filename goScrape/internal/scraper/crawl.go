package scraper

import (
	"fmt"
	"strings"
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

func ScrapeManhwaDetails(slug string) (models.ManhwaDetails, error) {
	// If slug doesn't start with /, add it
	if !strings.HasPrefix(slug, "/") {
		slug = "/" + slug
	}
	url := fmt.Sprintf("https://demonicscans.org%s", slug)

	html, err := FetchPage(url)
	if err != nil {
		return models.ManhwaDetails{}, err
	}

	return ParseManhwaDetails(html, url)
}

func ScrapeChapterPages(slug string) ([]models.Page, error) {
	// Ensure slug has leading /
	if !strings.HasPrefix(slug, "/") {
		slug = "/" + slug
	}
	url := fmt.Sprintf("https://demonicscans.org%s", slug)

	html, err := FetchPage(url)
	if err != nil {
		return nil, err
	}

	return ParseChapterPages(html)
}
