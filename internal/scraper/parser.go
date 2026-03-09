package scraper

import (
	"github.com/PuerkitoBio/goquery"
	"github.com/samjoshuadud/scrapeGo/internal/models"
	"strings"
)

// for now, we just parse the titles, but we can expand this to include more details like chapters, cover images, etc. based on the website's structure.
func ParseTitles(html string) ([]models.Manhwa, error) {

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))

	if err != nil {
		return []models.Manhwa{}, err
	}

	var manhwas []models.Manhwa

	doc.Find(".updates-element").Each(func(i int, s *goquery.Selection) {

		thumb := s.Find(".thumb a")

		title, _ := thumb.Attr("title")
		slug, _ := thumb.Attr("href")
		cover, _ := thumb.Find("img").Attr("src")

		manhwas = append(manhwas, models.Manhwa {
			Title: title,
			Slug: slug,
			Cover: cover,
		})

	})

	return manhwas, err

}
