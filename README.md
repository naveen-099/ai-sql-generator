# 🤖 AI SQL Generator

Type plain English → Get MySQL query + results instantly.

Built with Node.js, Express, React, MySQL and Groq LLaMA 3.3 AI.

## Features
- 💬 Type English → AI converts to SQL query
- ⚡ Runs query on MySQL and shows results in table
- 🕐 Query history saved automatically
- 📥 Export results to CSV
- 🔒 Only SELECT queries allowed (safe by design)

## Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Database:** MySQL
- **AI:** Groq LLaMA 3.3 (free)

## Setup

### 1. Database
```bash
mysql -u root -p < sql/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
# Edit .env with your DB credentials and Groq API key
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Open App
```
http://localhost:3000
```

## .env Configuration
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai_sql_generator
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Get free Groq API key: https://console.groq.com

## Example Queries
- "Show all users from Bengaluru"
- "Show all delivered orders"
- "Top 3 most expensive products"
- "Count orders by status"
- "Show orders placed in January 2026"

## GitHub
github.com/naveen-099/ai-sql-generator
