import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiHeart } from 'react-icons/fi';

const API = 'http://localhost:5006/api';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(null);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${API}/users/feed`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (swiping || currentIndex >= users.length) return;
    setSwiping(true);

    try {
      const res = await axios.post(`${API}/users/swipe`, {
        swiped_id: users[currentIndex].id,
        direction
      });

      if (res.data.matched) {
        setMatched(users[currentIndex]);
        setTimeout(() => setMatched(null), 3000);
      }

      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error swiping:', err);
    } finally {
      setSwiping(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <div className="home-container">
      {/* Match Animation */}
      {matched && (
        <div className="match-overlay">
          <div className="match-content">
            <h1>💕 It's a Match!</h1>
            <p>You and {matched.name} liked each other!</p>
            <img
              src={matched.photo_url || `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=100&name=${matched.name || 'U'}`}
              alt={matched.name}
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=100&name=${matched.name || 'U'}`; }}
            />
          </div>
        </div>
      )}

      {currentUser ? (
        <div className="card-container">
          <div className="swipe-card">
            <img
              src={currentUser.photo_url || `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=200&name=${currentUser.name || 'U'}`}
              alt={currentUser.name}
              className="card-image"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=200&name=${currentUser.name || 'U'}`; }}
            />
            <div className="card-info">
              <h2>{currentUser.name}{currentUser.age && `, ${currentUser.age}`}</h2>
              {currentUser.location && <p className="location">📍 {currentUser.location}</p>}
              {currentUser.bio && <p className="bio">{currentUser.bio}</p>}
            </div>
          </div>

          <div className="swipe-buttons">
            <button
              className="swipe-btn pass"
              onClick={() => handleSwipe('left')}
              disabled={swiping}
            >
              <FiX />
            </button>
            <button
              className="swipe-btn like"
              onClick={() => handleSwipe('right')}
              disabled={swiping}
            >
              <FiHeart />
            </button>
          </div>
        </div>
      ) : (
        <div className="no-users">
          <div className="emoji">🔍</div>
          <h3>No more profiles</h3>
          <p>Check back later for new people!</p>
          <button className="btn-primary" onClick={() => { setCurrentIndex(0); fetchFeed(); }}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}