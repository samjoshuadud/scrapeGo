import { Link } from "react-router-dom";
import type { Manhwa } from "../api";

interface ManhwaCardProps {
    manhwa: Manhwa;
}

export default function ManhwaCard({ manhwa }: ManhwaCardProps) {
    // Convert slug from "manga/xxx" → "manhwa/xxx" for our routes
    const detailSlug = manhwa.slug.replace(/^manga\//, "manhwa/");
    const normalizedSlug = detailSlug.startsWith("/") ? detailSlug.slice(1) : detailSlug;

    return (
        <Link
            to={`/${normalizedSlug}`}
            className="group block glass-card overflow-hidden hover:border-accent-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
        >
            {/* Cover image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-dark-800">
                <img
                    src={manhwa.cover}
                    alt={manhwa.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' fill='%2318181e'%3E%3Crect width='300' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%2352525e' font-family='sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle'%3ENo Cover%3C/text%3E%3C/svg%3E";
                    }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Title */}
            <div className="p-3">
                <h3 className="text-sm font-semibold text-dark-200 line-clamp-2 leading-snug group-hover:text-accent-400 transition-colors duration-200">
                    {manhwa.title}
                </h3>
            </div>
        </Link>
    );
}
