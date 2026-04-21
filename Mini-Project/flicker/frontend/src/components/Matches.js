import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5006/api';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${API}/matches`);
      setMatches(res.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="matches-container">
        <h2>💕 Your Matches</h2>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="matches-container">
      <h2>💕 Your Matches</h2>

      {matches.length > 0 ? (
        matches.map((match) => (
          <div
            key={match.match_id}
            className="match-card"
            onClick={() => navigate(`/chat/${match.match_id}`)}
          >
            <img
              className="match-avatar"
              src={match.photo_url || `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=60&name=${match.name || 'U'}`}
              alt={match.name}
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=60&name=${match.name || 'U'}`; }}
            />
            <div className="match-info">
              <h3>{match.name}{match.age && `, ${match.age}`}</h3>
              <p>{match.bio || 'Tap to start chatting! 💬'}</p>
            </div>
            <span className="match-time">{formatDate(match.matched_at)}</span>
          </div>
        ))
      ) : (
        <div className="no-matches">
          <div className="emoji">💫</div>
          <h3>No matches yet</h3>
          <p>Keep swiping to find your match!</p>
        </div>
      )}
    </div>
  );
}