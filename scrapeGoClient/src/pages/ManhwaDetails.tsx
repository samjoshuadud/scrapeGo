import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { fetchManhwaDetails, type ManhwaDetails as ManhwaDetailsType } from "../api";
import { DetailsSkeleton } from "../components/Loading";

export default function ManhwaDetails() {
    const location = useLocation();
    // The slug is everything after the leading "/"
    const slug = location.pathname.slice(1); // e.g. "manhwa/some-title"

    const [details, setDetails] = useState<ManhwaDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        fetchManhwaDetails(slug)
            .then((data) => {
                if (!cancelled) setDetails(data);
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
    }, [slug]);

    if (loading) return <DetailsSkeleton />;

    if (error) {
        return (
            <div className="page-enter max-w-5xl mx-auto px-4 py-16 text-center">
                <p className="text-red-400 text-lg">{error}</p>
                <Link to="/" className="mt-4 inline-block text-accent-400 hover:underline text-sm">
                    ← Back to home
                </Link>
            </div>
        );
    }

    if (!details) return null;

    // Sort chapters by chapter_num descending
    const sortedChapters = [...(details.chapters || [])].sort((a, b) => {
        return parseFloat(b.chapter_num) - parseFloat(a.chapter_num);
    });

    return (
        <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Back button */}
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-dark-400 hover:text-accent-400 text-sm mb-6 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to browse
            </Link>

            {/* Hero section */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Cover */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shadow-dark-950/80 border border-dark-700/40">
                        <img
                            src={details.cover}
                            alt={details.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%2318181e'%3E%3Crect width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%2352525e' font-family='sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle'%3ENo Cover%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 leading-tight">
                        {details.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm">
                        {details.author && (
                            <span className="text-dark-400">
                                by <span className="text-dark-200 font-medium">{details.author}</span>
                            </span>
                        )}
                        {details.status && (
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${details.status.toLowerCase().includes("ongoing")
                                        ? "bg-green-500/15 text-green-400 border border-green-500/20"
                                        : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                                    }`}
                            >
                                {details.status}
                            </span>
                        )}
                    </div>

                    {/* Genres */}
                    {details.genres && details.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {details.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 rounded-full bg-dark-800 border border-dark-700/60 text-dark-300 text-xs font-medium"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Summary */}
                    {details.summary && (
                        <div className="mt-5">
                            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">
                                Synopsis
                            </h2>
                            <p className="text-dark-400 text-sm leading-relaxed whitespace-pre-line">
                                {details.summary}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chapter list */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-dark-100">
                        Chapters
                        <span className="ml-2 text-sm font-normal text-dark-500">
                            ({sortedChapters.length})
                        </span>
                    </h2>
                </div>

                {sortedChapters.length === 0 ? (
                    <p className="text-dark-500 text-sm py-8 text-center">No chapters available</p>
                ) : (
                    <div className="glass-card divide-y divide-dark-700/40 max-h-[600px] overflow-y-auto">
                        {sortedChapters.map((ch) => (
                            <Link
                                key={ch.chapter_num}
                                to={`/read/${ch.manga}/${ch.chapter_num}`}
                                className="flex items-center justify-between px-4 py-3 hover:bg-dark-700/30 transition-colors duration-150 group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-accent-400 font-semibold text-sm shrink-0">
                                        Ch. {ch.chapter_num}
                                    </span>
                                    <span className="text-dark-300 text-sm truncate">
                                        {ch.title || `Chapter ${ch.chapter_num}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {ch.date && (
                                        <span className="text-dark-500 text-xs hidden sm:block">{ch.date}</span>
                                    )}
                                    <svg
                                        className="w-4 h-4 text-dark-600 group-hover:text-accent-400 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
