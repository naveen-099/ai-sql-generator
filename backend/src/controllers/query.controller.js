const db = require('../utils/db.utils');
const { generateSQLQuery } = require('../utils/ai.utils');

// POST /api/query — Convert English to SQL and execute
async function runQuery(req, res) {
  const { english_text } = req.body;

  if (!english_text || !english_text.trim()) {
    return res.status(400).json({ error: 'Please provide a question in English' });
  }

  let sqlQuery = '';
  let status = 'success';
  let errorMessage = null;
  let results = [];
  let fields = [];

  try {
    // Step 1 — Generate SQL from English using Groq AI
    sqlQuery = await generateSQLQuery(english_text.trim());

    // Step 2 — Execute the query on MySQL
    const [rows, fieldDefs] = await db.execute(sqlQuery);
    results = rows;
    fields = fieldDefs.map(f => f.name);

    // Step 3 — Save to history
    await db.execute(
      `INSERT INTO query_history (english_text, sql_query, row_count, status) VALUES (?, ?, ?, ?)`,
      [english_text.trim(), sqlQuery, results.length, 'success']
    );

    return res.json({
      success: true,
      english_text,
      sql_query: sqlQuery,
      row_count: results.length,
      fields,
      results
    });

  } catch (err) {
    status = 'error';
    errorMessage = err.message;

    // Save failed query to history too
    if (sqlQuery) {
      await db.execute(
        `INSERT INTO query_history (english_text, sql_query, row_count, status, error_message) VALUES (?, ?, ?, ?, ?)`,
        [english_text.trim(), sqlQuery, 0, 'error', errorMessage]
      ).catch(() => {}); // Don't fail if history insert fails
    }

    return res.status(500).json({
      success: false,
      english_text,
      sql_query: sqlQuery,
      error: errorMessage
    });
  }
}

// GET /api/query/history — Get all past queries
async function getHistory(req, res) {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM query_history ORDER BY created_at DESC LIMIT 50`
    );
    return res.json({ success: true, history: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// DELETE /api/query/history/:id — Delete a history entry
async function deleteHistory(req, res) {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM query_history WHERE id = ?`, [id]);
    return res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { runQuery, getHistory, deleteHistory };
