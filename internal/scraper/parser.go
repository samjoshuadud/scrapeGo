package scraper

import (
	"github.com/PuerkitoBio/goquery"
	"github.com/samjoshuadud/scrapeGo/internal/models"
	"strings"
	"regexp"
)

func ParseTitles(html string, url string) ([]models.Manhwa, error) {

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))

	// Extract domain from URL
	re := regexp.MustCompile(`https?://([^/]+)`)

	matches := re.FindStringSubmatch(url)

	domain := ""

	if len(matches) > 1 {
		domain = matches[1]
	}

	if err != nil {
		return []models.Manhwa{}, err
	}

	var manhwas []models.Manhwa

  // elements for the manhwa cover
	doc.Find(".updates-element").Each(func(i int, s *goquery.Selection) {

		thumb := s.Find(".thumb a")

		title, _ := thumb.Attr("title")
		slug, _ := thumb.Attr("href")
		cover, _ := thumb.Find("img").Attr("src")

		manhwas = append(manhwas, models.Manhwa {
			Title: title,
			Domain: domain,
			Slug: slug,
			Cover: cover,
		})

	})

	return manhwas, err

}
