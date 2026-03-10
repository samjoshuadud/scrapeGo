package utils

import (
	"github.com/samjoshuadud/scrapeGo/internal/models"
	"sync"
	"time"
)

type Cache struct {
	sync.RWMutex

	Data []models.Manhwa

	Timestamp time.Time
	Ttl       time.Duration
}

func NewCache(ttl time.Duration) *Cache {
	return &Cache{
		Data:      []models.Manhwa{},
		Timestamp: time.Now(),
		Ttl:       ttl,
	}
}

// checking if cache still valid

func (c *Cache) Get() ([]models.Manhwa, bool, bool) {
	c.RLock()

	defer c.RUnlock()

	if len(c.Data) == 0{
		return nil, false, false
	}

	
	expired := time.Since(c.Timestamp) >= c.Ttl

	return c.Data, true, expired

}

func (c *Cache) Set(data []models.Manhwa) {
	c.Lock()

	defer c.Unlock()
	c.Data = data
	c.Timestamp = time.Now()

}
