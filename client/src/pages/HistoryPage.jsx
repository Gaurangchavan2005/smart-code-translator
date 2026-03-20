import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import HistoryList from "../components/HistoryList.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from "../services/historyService.js";
import "../styles/history.css";

function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(currentPage, ITEMS_PER_PAGE);
      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
      setTotalEntries(data.totalEntries || 0);
    } catch {
      toast.error("Failed to load history");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success("Deleted");
      if (selectedEntry?._id === id) setSelectedEntry(null);
      fetchHistory();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Delete all history?")) return;
    try {
      const r = await clearHistory();
      toast.success(`Cleared ${r.deletedCount} entries`);
      setEntries([]);
      setTotalEntries(0);
      setTotalPages(1);
      setSelectedEntry(null);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to clear");
    }
  };

  return (
    <div className="history-page">

      {/* Header */}
      <div className="history-header">
        <h2>History</h2>
        <button onClick={handleClearAll} className="clear-btn">
          Clear All
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* History List */}
          <HistoryList
            entries={entries}
            onDelete={handleDelete}
            onSelect={setSelectedEntry}
          />

          {/* Detail Panel */}
          {selectedEntry && (
            <div className="detail-output-box">

              {/* TRANSLATE */}
              {selectedEntry.type === "translate" && (
                <div>
                  <span className="detail-lang-badge">
                    Target: {selectedEntry.targetLanguage}
                  </span>
                  <pre className="detail-code-block">
                    {selectedEntry.output?.translatedCode}
                  </pre>
                </div>
              )}

              {/* ANALYZE */}
              {selectedEntry.type === "analyze" && (
                <div>
                  <div className="detail-complexity-row">
                    <div className="detail-complexity-card">
                      <div>Time</div>
                      <div>
                        {selectedEntry.output?.timeComplexity}
                      </div>
                    </div>

                    <div className="detail-complexity-card">
                      <div>Space</div>
                      <div>
                        {selectedEntry.output?.spaceComplexity}
                      </div>
                    </div>
                  </div>

                  {selectedEntry.output?.explanation && (
                    <p className="detail-text">
                      {selectedEntry.output.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* OPTIMIZE */}
              {selectedEntry.type === "optimize" && (
                <div>
                  <pre className="detail-code-block">
                    {selectedEntry.output?.optimizedCode}
                  </pre>

                  {selectedEntry.output?.suggestions && (
                    <p className="detail-text">
                      {selectedEntry.output.suggestions}
                    </p>
                  )}
                </div>
              )}

              {/* EXPLAIN */}
              {selectedEntry.type === "explain" && (
                <p className="detail-text">
                  {selectedEntry.output?.explanation}
                </p>
              )}

            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="history-pagination">

              <button
                className="page-btn"
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${
                    currentPage === p ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>

            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HistoryPage;