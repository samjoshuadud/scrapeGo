export function CardSkeleton() {
    return (
        <div className="glass-card overflow-hidden">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-3 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-3 skeleton w-1/2" />
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </>
    );
}

export function DetailsSkeleton() {
    return (
        <div className="page-enter max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-72 shrink-0">
                    <div className="aspect-[3/4] skeleton rounded-xl" />
                </div>
                <div className="flex-1 space-y-4">
                    <div className="h-8 skeleton w-2/3" />
                    <div className="h-4 skeleton w-1/3" />
                    <div className="h-4 skeleton w-1/4" />
                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 w-16 skeleton rounded-full" />
                        ))}
                    </div>
                    <div className="space-y-2 mt-6">
                        <div className="h-3 skeleton w-full" />
                        <div className="h-3 skeleton w-full" />
                        <div className="h-3 skeleton w-4/5" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Spinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-dark-600 border-t-accent-500 rounded-full animate-spin" />
        </div>
    );
}
