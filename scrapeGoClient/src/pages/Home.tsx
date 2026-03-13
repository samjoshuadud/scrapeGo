import { useEffect, useState, useRef, useCallback } from "react";
import { fetchManhwas, type Manhwa } from "../api";
import ManhwaCard from "../components/ManhwaCard";
import { CardGridSkeleton } from "../components/Loading";

export default function Home() {
    const [manhwas, setManhwas] = useState<Manhwa[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");
    const observer = useRef<IntersectionObserver | null>(null);

    const lastManhwaElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        fetchManhwas(page)
            .then((data) => {
                if (!cancelled) {
                    setManhwas((prev) => [...prev, ...data]);
                    // If we get fewer than 10 items (or zero), we might be at the end.
                    // The scrapeGo API doesn't return a total, so we guess based on result size.
                    setHasMore(data.length > 0);
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [page]);

    return (
        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-dark-100">
                    Trending <span className="text-accent-400">Manhwa</span>
                </h1>
                <p className="mt-2 text-dark-400 text-sm">
                    Discover the latest and hottest titles
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="glass-card p-4 mb-6 text-red-400 text-sm border-red-500/30">
                    {error} — Make sure your scrapeGo server is running on port 8080.
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {manhwas.map((m, index) => {
                    if (manhwas.length === index + 1) {
                        return (
                            <div ref={lastManhwaElementRef} key={m.slug}>
                                <ManhwaCard manhwa={m} />
                            </div>
                        );
                    } else {
                        return <ManhwaCard key={m.slug} manhwa={m} />;
                    }
                })}
                {loading && <CardGridSkeleton count={12} />}
            </div>

            {/* Empty */}
            {!loading && !error && manhwas.length === 0 && (
                <div className="text-center py-20 text-dark-500">
                    <p className="text-lg">No manhwa found</p>
                    <p className="text-sm mt-1">Try refreshing or check your backend</p>
                </div>
            )}

            {/* End of results */}
            {!hasMore && manhwas.length > 0 && (
                <div className="text-center py-10 text-dark-500 text-sm">
                    You've reached the end of the list.
                </div>
            )}
        </div>
    );
}
