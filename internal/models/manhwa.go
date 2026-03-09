package models

type Manhwa struct {
	Title string `json:"title"`
	Slug  string `json:"slug"`
	Cover string `json:"cover"`
}

type Chapter struct {
	Title      string  `json:"title"`
	Number     float64 `json:"number"`
	Slug       string  `json:"slug"`
	URL        string  `json:"url"`
}

type Page struct {
	PageNumber int    `json:"page"`
	ImageURL   string `json:"image_url"`
}
