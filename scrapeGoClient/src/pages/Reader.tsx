import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapterPages, type Page } from "../api";
import { Spinner } from "../components/Loading";

export default function Reader() {
    const { manga, chapter } = useParams<{ manga: string; chapter: string }>();
    const navigate = useNavigate();

    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showControls, setShowControls] = useState(true);

    const chapterNum = parseFloat(chapter || "1");

    useEffect(() => {
        if (!manga || !chapter) return;
        let cancelled = false;
        setLoading(true);
        setError("");

        fetchChapterPages(manga, chapter)
            .then((data) => {
                if (!cancelled) setPages(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
                window.scrollTo(0, 0);
            });

        return () => {
            cancelled = true;
        };
    }, [manga, chapter]);

    // Auto-hide controls on scroll
    useEffect(() => {
        let lastY = 0;
        const handleScroll = () => {
            const y = window.scrollY;
            setShowControls(y < 100 || y < lastY);
            lastY = y;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const goToChapter = useCallback(
        (num: number) => {
            // Handle both integer and decimal chapter numbers
            const formatted = Number.isInteger(num) ? num.toString() : num.toString();
            navigate(`/read/${manga}/${formatted}`);
        },
        [manga, navigate]
    );

    if (loading) return <Spinner />;

    if (error) {
        return (
            <div className="page-enter max-w-2xl mx-auto px-4 py-20 text-center">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-accent-400 hover:underline text-sm"
                >
                    ← Go back
                </button>
            </div>
        );
    }

    return (
        <div className="page-enter">
            {/* Top bar */}
            <div
                className={`fixed top-16 left-0 right-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-dark-700/50 transition-all duration-300 ${showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    }`}
            >
                <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-dark-400 hover:text-dark-100 text-sm flex items-center gap-1 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <span className="text-dark-200 text-sm font-semibold">
                        Chapter {chapter}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToChapter(chapterNum - 1)}
                            disabled={chapterNum <= 1}
                            className="p-1.5 rounded-lg bg-dark-800 border border-dark-700/60 text-dark-400 hover:text-dark-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => goToChapter(chapterNum + 1)}
                            className="p-1.5 rounded-lg bg-dark-800 border border-dark-700/60 text-dark-400 hover:text-dark-100 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pages */}
            <div className="max-w-3xl mx-auto" onClick={() => setShowControls((v) => !v)}>
                {pages.map((p) => (
                    <div key={p.page} className="w-full">
                        <img
                            src={p.image_url}
                            alt={`Page ${p.page}`}
                            loading="lazy"
                            className="w-full h-auto block"
                            style={{ minHeight: "200px", background: "var(--color-dark-900)" }}
                        />
                    </div>
                ))}
            </div>

            {/* Bottom navigation */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="glass-card p-4 flex items-center justify-between">
                    <button
                        onClick={() => goToChapter(chapterNum - 1)}
                        disabled={chapterNum <= 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-dark-800 border border-dark-700/60 text-dark-300 hover:bg-dark-700 hover:text-dark-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        ← Prev Chapter
                    </button>
                    <span className="text-dark-400 text-sm">
                        {pages.length} pages
                    </span>
                    <button
                        onClick={() => goToChapter(chapterNum + 1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-600 hover:bg-accent-500 text-white transition-all"
                    >
                        Next Chapter →
                    </button>
                </div>
            </div>
        </div>
    );
}
