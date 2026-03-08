package scraper

import (
   "strings"
	  "github.com/PuerkitoBio/goquery"
)



// for now, we just parse the titles, but we can expand this to include more details like chapters, cover images, etc. based on the website's structure.
func ParseTitles(html string) ([]string, error) {

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))

	if err != nil {
		return []string{}, err
	}

	titles := make([]string, 0)

	// change based on the website's structure, this is just an example

	doc.Find("updates-element h2 a").Each(func(i int, s *goquery.Selection) {
		title := strings.TrimSpace(s.Text())
		if title != "" {

			titles = append(titles, title)
		}
		})

	return titles, err

}
