export default function HistoryList({ history, onSelect, currentId, loading, fetching }) {

    return (
        <div className="bg-app-surface p-6 rounded-2xl shadow-md mt-6">
            <h3 className="text-lg font-semibold text-content-main mb-4 flex items-center">
                <span className="mr-2">📜</span> Recent Uploads
            </h3>

            {fetching && (
                <div className="text-sm text-content-muted">
                    Loading upload history...
                </div>
            )}

            {!fetching && (!history || history.length === 0) && (
                <div className="text-sm text-content-muted">
                    No previous datasets yet. Upload a CSV to get started.
                </div>
            )}

            {!fetching && history && history.length > 0 && (
                <div className="space-y-2">
                    {history.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            disabled={loading}
                            className={`w-full text-left p-3 rounded-xl transition-all ${currentId === item.id
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-app-bg text-content-main hover:opacity-80"
                                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium truncate mr-2">{item.filename}</span>
                                <span className={`text-xs ${currentId === item.id ? "text-primary-light" : "text-content-muted"}`}>
                                    {new Date(item.uploaded_at).toLocaleDateString()}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
