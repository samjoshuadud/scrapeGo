package scraper

import (
	"github.com/PuerkitoBio/goquery"
	"github.com/samjoshuadud/scrapeGo/internal/models"
	"strings"
	"regexp"
)

func extractDomain(url string) string {
	re := regexp.MustCompile(`https?://([^/]+)`)
	matches := re.FindStringSubmatch(url)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func ParseTitles(html string, url string) ([]models.Manhwa, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return []models.Manhwa{}, err
	}

	domain := extractDomain(url)
	var manhwas []models.Manhwa

	// elements for the manhwa cover
	doc.Find(".updates-element").Each(func(i int, s *goquery.Selection) {
		thumb := s.Find(".thumb a")

		title, _ := thumb.Attr("title")
		slug, _ := thumb.Attr("href")
		cover, _ := thumb.Find("img").Attr("src")

		manhwas = append(manhwas, models.Manhwa{
			Title:  title,
			Domain: domain,
			Slug:   slug,
			Cover:  cover,
		})
	})

	return manhwas, nil
}

func ParseSearchResults(html string, url string) ([]models.Manhwa, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return []models.Manhwa{}, err
	}

	domain := extractDomain(url)
	var manhwas []models.Manhwa

	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		slug, exists := s.Attr("href")
		if !exists || !strings.HasPrefix(slug, "/manga/") {
			return
		}

		title := strings.TrimSpace(s.Find("li div div:first-child").Text())
		cover, _ := s.Find("img").Attr("src")

		manhwas = append(manhwas, models.Manhwa{
			Title:  title,
			Domain: domain,
			Slug:   slug,
			Cover:  cover,
		})
	})

	return manhwas, nil
}
