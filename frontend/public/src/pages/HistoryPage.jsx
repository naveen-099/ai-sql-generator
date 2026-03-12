import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchHistory() {
    try {
      const { data } = await axios.get('/api/query/history');
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEntry(id) {
    try {
      await axios.delete(`/api/query/history/${id}`);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  }

  useEffect(() => { fetchHistory(); }, []);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading history...</span>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>🕐 Query History</h2>
        <span className="history-count">{history.length} queries</span>
      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <p>🔍</p>
          <span>No queries yet. Go to Query tab and ask something!</span>
        </div>
      ) : (
        history.map(item => (
          <div key={item.id} className="history-item">
            <div className="history-item-header">
              <span className="history-english">"{item.english_text}"</span>
              <div className="history-meta">
                <span className={`badge ${item.status === 'success' ? 'success' : 'error'}`}>
                  {item.status === 'success' ? '✅' : '❌'}
                </span>
                <span className="history-time">{formatDate(item.created_at)}</span>
                <button className="delete-btn" onClick={() => deleteEntry(item.id)}>
                  🗑 Delete
                </button>
              </div>
            </div>

            <pre className="history-sql">{item.sql_query}</pre>

            <div className="history-footer">
              <span className="history-rows">
                {item.status === 'success'
                  ? `${item.row_count} row${item.row_count !== 1 ? 's' : ''} returned`
                  : `Error: ${item.error_message}`}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
