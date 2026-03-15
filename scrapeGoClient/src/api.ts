const API_BASE = import.meta.env.VITE_API_URL || "/api";

// ─── Types ───────────────────────────────────────────────────────────

export interface Manhwa {
    title: string;
    slug: string;
    cover: string;
    domain: string;
}

export interface Chapter {
    title: string;
    slug: string;
    manga: string;
    chapter_num: string;
    date: string;
    url: string;
}

export interface Page {
    page: number;
    image_url: string;
}

export interface ManhwaDetails {
    title: string;
    cover: string;
    summary: string;
    author: string;
    status: string;
    genres: string[];
    chapters: Chapter[];
}

// ─── Fetch Helpers ───────────────────────────────────────────────────

export async function fetchManhwas(page: number = 1): Promise<Manhwa[]> {
    const res = await fetch(`${API_BASE}/manhwas?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch manhwas");
    return res.json();
}

export async function fetchManhwaDetails(slug: string): Promise<ManhwaDetails> {
    // slug comes in like "manhwa/some-title" — we hit /api/manhwa/some-title
    const res = await fetch(`${API_BASE}/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch manhwa details");
    return res.json();
}

export async function fetchChapterPages(
    manga: string,
    chapter: string
): Promise<Page[]> {
    const res = await fetch(
        `${API_BASE}/chapter?manga=${encodeURIComponent(manga)}&chapter=${encodeURIComponent(chapter)}`
    );
    if (!res.ok) throw new Error("Failed to fetch chapter pages");
    return res.json();
}

export async function searchManhwas(query: string): Promise<Manhwa[]> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Search failed");
    return res.json();
}
