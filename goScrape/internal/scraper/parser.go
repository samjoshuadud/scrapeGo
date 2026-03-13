package scraper

import (
	"github.com/PuerkitoBio/goquery"
	"github.com/samjoshuadud/scrapeGo/internal/models"
	neturl "net/url"
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
	manhwas := []models.Manhwa{}

	// elements for the manhwa cover
	doc.Find(".updates-element").Each(func(i int, s *goquery.Selection) {
		thumb := s.Find(".thumb a")

		title, _ := thumb.Attr("title")
		slug, _ := thumb.Attr("href")
		// Translate slug for our API
		slug = strings.Replace(slug, "/manga/", "/manhwa/", 1)
		
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
	manhwas := []models.Manhwa{}

	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		slug, exists := s.Attr("href")
		if !exists || !strings.HasPrefix(slug, "/manga/") {
			return
		}

		// Translate slug for our API
		apiSlug := strings.Replace(slug, "/manga/", "/manhwa/", 1)

		// The title is in the first div inside the container div
		title := strings.TrimSpace(s.Find("li div div:first-child").Text())
		if title == "" {
			title = strings.TrimSpace(s.Find("li div").First().Text())
		}
		
		cover, _ := s.Find("img").Attr("src")

		manhwas = append(manhwas, models.Manhwa{
			Title:  title,
			Domain: domain,
			Slug:   apiSlug,
			Cover:  cover,
		})
	})

	return manhwas, nil
}

func ParseChapterPages(html string) ([]models.Page, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return []models.Page{}, err
	}

	pages := []models.Page{}
	count := 1
	doc.Find("img.imgholder").Each(func(i int, s *goquery.Selection) {
		src, exists := s.Attr("src")
		if !exists || src == "" {
			return
		}

		if strings.Contains(src, "free_ads.jpg") || strings.Contains(src, "PayPal.svg") {
			return
		}

		pages = append(pages, models.Page{
			PageNumber: count,
			ImageURL:   src,
		})
		count++
	})

	return pages, nil
}

func ParseManhwaDetails(html string, url string) (models.ManhwaDetails, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return models.ManhwaDetails{}, err
	}

	var details models.ManhwaDetails
	details.Title = strings.TrimSpace(doc.Find("title").Text())
	details.Cover, _ = doc.Find("#manga-page img").Attr("src")
	details.Summary = strings.TrimSpace(doc.Find(".white-font").First().Text())

	doc.Find("#manga-info-stats .flex-row").Each(func(i int, s *goquery.Selection) {
		label := strings.ToLower(strings.TrimSpace(s.Find("li:first-child").Text()))
		value := strings.TrimSpace(s.Find("li:last-child").Text())

		switch label {
		case "author":
			details.Author = value
		case "status":
			details.Status = value
		}
	})

	details.Chapters = []models.Chapter{}
	doc.Find("#chapters-list li").Each(func(i int, s *goquery.Selection) {
		link := s.Find("a")
		title := strings.TrimSpace(link.Text())

		date := strings.TrimSpace(link.Find("span").Text())
		title = strings.TrimSpace(strings.Replace(title, date, "", -1))

		href, _ := link.Attr("href")

		// Parse manga and chapter from the slug for clean API usage
		var mangaID, chapterNum string
		if parsed, err := neturl.Parse(href); err == nil {
			mangaID = parsed.Query().Get("manga")
			chapterNum = parsed.Query().Get("chapter")
		}

		details.Chapters = append(details.Chapters, models.Chapter{
			Title:      title,
			Slug:       href,
			Manga:      mangaID,
			ChapterNum: chapterNum,
			Date:       date,
			URL:        extractDomain(url) + href,
		})
	})

	return details, nil
}
