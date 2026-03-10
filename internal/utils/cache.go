package utils

import (
	"fmt"
	"sync"
	"time"

	"github.com/samjoshuadud/scrapeGo/internal/models"
)

type PageData struct {
	Data      []models.Manhwa
	Timestamp time.Time
}

type Cache struct {
	sync.RWMutex
	Pages map[int]PageData
	Ttl   time.Duration
}

func NewCache(ttl time.Duration) *Cache {
	return &Cache{
		Pages: make(map[int]PageData),
		Ttl:   ttl,
	}
}

// Get checks if a specific page is in the cache and if it's expired
func (c *Cache) Get(page int) ([]models.Manhwa, bool, bool) {
	c.RLock()
	defer c.RUnlock()

	pageData, exists := c.Pages[page]
	if !exists {
		return nil, false, false
	}

	expired := time.Since(pageData.Timestamp) >= c.Ttl
	return pageData.Data, true, expired
}

// Set saves data for a specific page
func (c *Cache) Set(page int, data []models.Manhwa) {
	c.Lock()
	defer c.Unlock()

	c.Pages[page] = PageData{
		Data:      data,
		Timestamp: time.Now(),
	}
}

// prints the current pages in memory for debugging
func (c *Cache) LogState() {
	c.RLock()
	defer c.RUnlock()

	fmt.Printf("\n--- [CACHE DEBUG] ---\n")
	if len(c.Pages) == 0 {
		fmt.Println("Cache is empty")
	} else {
		for page, pageData := range c.Pages {
			status := "FRESH"
			if time.Since(pageData.Timestamp) >= c.Ttl {
				status = "EXPIRED"
			}
			fmt.Printf("Page %d: %d items (%s, cached at %s)\n",
				page, len(pageData.Data), status, pageData.Timestamp.Format("15:04:05"))
		}
	}
	fmt.Printf("---------------------\n\n")
}
