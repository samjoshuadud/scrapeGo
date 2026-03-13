import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchManhwas, type Manhwa } from "../api";
import ManhwaCard from "../components/ManhwaCard";
import { CardGridSkeleton } from "../components/Loading";

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<Manhwa[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query) return;
        let cancelled = false;
        setLoading(true);
        setError("");

        searchManhwas(query)
            .then((data) => {
                if (!cancelled) setResults(data || []);
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
    }, [query]);

    return (
        <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-dark-400 hover:text-accent-400 text-sm mb-4 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to browse
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-100">
                    Search results for{" "}
                    <span className="text-accent-400">"{query}"</span>
                </h1>
                {!loading && (
                    <p className="mt-2 text-dark-500 text-sm">
                        {results.length} result{results.length !== 1 ? "s" : ""} found
                    </p>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="glass-card p-4 mb-6 text-red-400 text-sm border-red-500/30">
                    {error}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {loading ? (
                    <CardGridSkeleton count={12} />
                ) : (
                    results.map((m) => <ManhwaCard key={m.slug} manhwa={m} />)
                )}
            </div>

            {/* Empty state */}
            {!loading && !error && query && results.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-dark-400 text-lg">No results found</p>
                    <p className="text-dark-500 text-sm mt-1">
                        Try a different search term
                    </p>
                </div>
            )}

            {/* No query */}
            {!query && (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">✨</div>
                    <p className="text-dark-400 text-lg">Type something to search</p>
                </div>
            )}
        </div>
    );
}
