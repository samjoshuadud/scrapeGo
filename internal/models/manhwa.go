package models

type Manhwa struct {
	Title string `json:"title"`
	Slug	string `json:"slug"`
	Cover string `json:"cover"`
	Chapters []Chapter `json:"chapters"`
}


type Chapter struct {
   Title string `json:"title"`
   URL string `json:"url"`
}


