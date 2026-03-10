package scraper

import (
	"fmt"
	"sync"

	"github.com/samjoshuadud/scrapeGo/internal/models"
)

// Crawl performs a multi-worker crawl of the demonicscans last updates.
func Crawl() ([]models.Manhwa, error) {
	const workers = 5
	pages := make(chan int)
	results := make(chan []models.Manhwa)
	done := make(chan struct{})

	var wg sync.WaitGroup
	var once sync.Once

	stop := func() {
		once.Do(func() {
			close(done)
		})
	}

	// Start workers
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-done:
					return
				case page, ok := <-pages:
					if !ok {
						return
					}

					url := fmt.Sprintf("https://demonicscans.org/lastupdates.php?list=%d", page)
					html, err := FetchPage(url)
					if err != nil {
						continue
					}

					manhwas, err := ParseTitles(html, url)
					if err != nil {
						continue
					}

					// If we get an empty page, it means we've reached the end of the list
					if len(manhwas) == 0 {
						stop()
						return
					}

					results <- manhwas

					// If we get less than 20 manhwas, it's likely the last page
					if len(manhwas) < 20 {
						stop()
						return
					}
				}
			}
		}()
	}

	// Page generator
	go func() {
		defer close(pages)
		for i := 1; ; i++ {
			select {
			case <-done:
				return
			case pages <- i:
			}
		}
	}()

	// Closer for results
	go func() {
		wg.Wait()
		close(results)
	}()

	var allManhwas []models.Manhwa
	for res := range results {
		allManhwas = append(allManhwas, res...)
	}

	return allManhwas, nil
}
