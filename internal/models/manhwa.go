package models

type Manhwa struct {
	Title  string `json:"title"`
	Slug   string `json:"slug"`
	Cover  string `json:"cover"`
	Domain string `json:"domain"`
}

type Chapter struct {
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	Manga      string `json:"manga"`
	ChapterNum string `json:"chapter_num"`
	Date       string `json:"date"`
	URL        string `json:"url"`
}

type Page struct {
	PageNumber int    `json:"page"`
	ImageURL   string `json:"image_url"`
}

type ManhwaDetails struct {
	Title    string    `json:"title"`
	Cover    string    `json:"cover"`
	Summary  string    `json:"summary"`
	Author   string    `json:"author"`
	Status   string    `json:"status"`
	Genres   []string  `json:"genres"`
	Chapters []Chapter `json:"chapters"`
}
