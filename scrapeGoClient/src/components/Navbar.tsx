import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchManhwas, type Manhwa } from "../api";

export default function Navbar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Manhwa[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Debounced search
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (query.trim().length >= 2) {
            searchTimeout.current = setTimeout(async () => {
                setLoading(true);
                try {
                    const data = await searchManhwas(query);
                    setResults(data?.slice(0, 6) || []); // Only show top 6
                    setShowDropdown(true);
                } catch (err) {
                    console.error("Live search failed", err);
                } finally {
                    setLoading(false);
                }
            }, 300);
        } else {
            setResults([]);
            setShowDropdown(false);
        }

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [query]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            setQuery("");
            setShowDropdown(false);
        }
    };

    const handleResultClick = (slug: string) => {
        // Normalize slug like in ManhwaCard
        const detailSlug = slug.replace(/^manga\//, "manhwa/");
        const normalizedSlug = detailSlug.startsWith("/") ? detailSlug.slice(1) : detailSlug;
        navigate(`/${normalizedSlug}`);
        setQuery("");
        setShowDropdown(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-black text-sm group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-shadow duration-300">
                        M
                    </div>
                    <span className="text-lg font-bold text-dark-100 hidden sm:block">
                        Manhwa<span className="text-accent-400">Verse</span>
                    </span>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-md relative" ref={dropdownRef}>
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                                placeholder="Search manhwa..."
                                className="w-full pl-10 pr-4 py-2 bg-dark-800/80 border border-dark-700/60 rounded-full text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-accent-500/60 focus:ring-1 focus:ring-accent-500/30 transition-all duration-200"
                            />
                            {loading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-dark-600 border-t-accent-500 rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Results Dropdown */}
                    {showDropdown && (results.length > 0 || loading) && (
                        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            {results.map((m) => (
                                <button
                                    key={m.slug}
                                    onClick={() => handleResultClick(m.slug)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-dark-700/50 rounded-lg transition-colors group text-left"
                                >
                                    <img
                                        src={m.cover}
                                        alt=""
                                        className="w-10 h-14 object-cover rounded bg-dark-900 border border-dark-700/30"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark-200 truncate group-hover:text-accent-400">
                                            {m.title}
                                        </p>
                                        <p className="text-xs text-dark-500 truncate">Manhwa</p>
                                    </div>
                                </button>
                            ))}
                            {results.length > 0 && (
                                <button
                                    onClick={handleSearch}
                                    className="w-full py-2 text-center text-xs font-semibold text-accent-400 hover:bg-accent-500/10 transition-colors border-t border-dark-700/40 mt-1"
                                >
                                    See all results
                                </button>
                            )}
                            {results.length === 0 && !loading && (
                                <div className="p-4 text-center text-dark-500 text-sm">
                                    No results found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Nav links */}
                <div className="flex items-center gap-1 shrink-0">
                    <Link
                        to="/"
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-all duration-200"
                    >
                        Browse
                    </Link>
                </div>
            </div>
        </nav>
    );
}
