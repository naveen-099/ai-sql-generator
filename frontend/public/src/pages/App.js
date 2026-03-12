import React, { useState } from 'react';
import QueryPage from './pages/QueryPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('query');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <div>
              <h1>AI SQL Generator</h1>
              <p>Type English → Get MySQL Query + Results</p>
            </div>
          </div>
          <nav className="nav">
            <button
              className={activeTab === 'query' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('query')}
            >
              ⚡ Query
            </button>
            <button
              className={activeTab === 'history' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('history')}
            >
              🕐 History
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === 'query' ? <QueryPage /> : <HistoryPage />}
      </main>
    </div>
  );
}
