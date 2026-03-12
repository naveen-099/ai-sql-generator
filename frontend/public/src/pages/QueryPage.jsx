import React, { useState } from 'react';
import axios from 'axios';

const EXAMPLES = [
  'Show all users from Bengaluru',
  'Show all delivered orders',
  'Top 3 most expensive products',
  'Count orders by status',
  'Show orders placed in January 2026',
  'List all Electronics products',
  'Show users who placed orders',
];

function exportToCSV(fields, results, englishText) {
  const header = fields.join(',');
  const rows = results.map(row =>
    fields.map(f => {
      const val = row[f] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `query_results_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function QueryPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleRun() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data } = await axios.post('/api/query', { english_text: input });
      setResult(data);
    } catch (err) {
      const errData = err.response?.data;
      setError(errData || { error: 'Something went wrong. Please try again.' });
      if (errData?.sql_query) setResult({ sql_query: errData.sql_query, failed: true });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleRun();
  }

  return (
    <div className="query-page">

      {/* Input Card */}
      <div className="input-card">
        <h2>💬 Ask in plain English</h2>

        <div className="example-chips">
          {EXAMPLES.map(ex => (
            <span key={ex} className="chip" onClick={() => setInput(ex)}>
              {ex}
            </span>
          ))}
        </div>

        <div className="input-row">
          <input
            className="text-input"
            placeholder="e.g. Show all orders with status delivered..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="run-btn" onClick={handleRun} disabled={loading || !input.trim()}>
            {loading ? '⏳ Running...' : '⚡ Run Query'}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <span>AI is generating your SQL query...</span>
        </div>
      )}

      {/* SQL Query Display */}
      {(result?.sql_query || error?.sql_query) && !loading && (
        <div className="sql-card">
          <div className="sql-header">
            <h3>Generated SQL Query</h3>
            <span className={`badge ${result?.failed || error ? 'error' : 'success'}`}>
              {result?.failed || error ? '❌ Failed' : '✅ Success'}
            </span>
          </div>
          <pre className="sql-code">{result?.sql_query || error?.sql_query}</pre>
          {error && <div className="error-msg">⚠️ {error.error}</div>}
        </div>
      )}

      {/* Results Table */}
      {result && !result.failed && result.results && !loading && (
        <div className="results-card">
          <div className="results-header">
            <div>
              <h3>Query Results</h3>
              <span className="row-count">{result.row_count} row{result.row_count !== 1 ? 's' : ''} returned</span>
            </div>
            {result.results.length > 0 && (
              <button
                className="export-btn"
                onClick={() => exportToCSV(result.fields, result.results, input)}
              >
                📥 Export CSV
              </button>
            )}
          </div>

          {result.results.length === 0 ? (
            <div className="no-results">No results found for this query.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {result.fields.map(f => <th key={f}>{f}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((row, i) => (
                    <tr key={i}>
                      {result.fields.map(f => (
                        <td key={f}>{row[f] !== null && row[f] !== undefined ? String(row[f]) : '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
