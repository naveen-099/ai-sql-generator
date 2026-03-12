const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Database schema context — AI uses this to write correct SQL
const DB_SCHEMA = `
You are an expert MySQL query generator. Convert English text to valid MySQL queries.

Database: ai_sql_generator

Tables and columns:

1. users
   - id (INT, PRIMARY KEY)
   - name (VARCHAR)
   - email (VARCHAR)
   - city (VARCHAR)
   - created_at (TIMESTAMP)

2. products
   - id (INT, PRIMARY KEY)
   - name (VARCHAR)
   - category (VARCHAR)
   - price (DECIMAL)
   - stock (INT)

3. orders
   - id (INT, PRIMARY KEY)
   - user_id (INT, FK → users.id)
   - total_amount (DECIMAL)
   - status (ENUM: pending, confirmed, shipped, delivered, cancelled)
   - created_at (TIMESTAMP)

4. order_items
   - id (INT, PRIMARY KEY)
   - order_id (INT, FK → orders.id)
   - product_id (INT, FK → products.id)
   - quantity (INT)
   - price (DECIMAL)

5. query_history
   - id (INT, PRIMARY KEY)
   - english_text (TEXT)
   - sql_query (TEXT)
   - row_count (INT)
   - status (ENUM: success, error)
   - error_message (TEXT)
   - created_at (TIMESTAMP)

STRICT RULES:
- Return ONLY a valid MySQL SELECT query
- Never return INSERT, UPDATE, DELETE, DROP queries
- Always use proper JOINs when combining tables
- Use aliases for readability
- Return ONLY the SQL query — no explanation, no markdown, no backticks
- If the request is unclear, return the best possible SELECT query
`;

async function generateSQLQuery(englishText) {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    max_tokens: 500,
    messages: [
      { role: 'system', content: DB_SCHEMA },
      { role: 'user', content: `Convert this to MySQL query: ${englishText}` }
    ]
  });

  let raw = response.choices[0]?.message?.content?.trim() || '';

  // Clean up any markdown formatting AI might add
  raw = raw.replace(/```sql/gi, '').replace(/```/g, '').trim();

  // Ensure it starts with SELECT for safety
  if (!raw.toUpperCase().startsWith('SELECT')) {
    throw new Error('AI generated a non-SELECT query. Only SELECT queries are allowed.');
  }

  return raw;
}

module.exports = { generateSQLQuery };
