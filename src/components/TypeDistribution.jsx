export default function TypeDistribution({ distribution }) {
    if (!distribution) return null;

    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    const colors = [
        "bg-primary",
        "bg-flowrate",
        "bg-pressure",
        "bg-temperature",
        "bg-purple-500",
        "bg-pink-500",
        "bg-cyan-500",
        "bg-lime-500",
    ];

    return (
        <div className="bg-app-surface p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-content-main mb-4">Equipment Types</h3>

            <div className="space-y-4">
                {Object.entries(distribution).map(([type, count], index) => {
                    const percentage = Math.round((count / total) * 100);
                    return (
                        <div key={type}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-content-main">{type}</span>
                                <span className="text-sm text-content-muted">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-app-bg rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
