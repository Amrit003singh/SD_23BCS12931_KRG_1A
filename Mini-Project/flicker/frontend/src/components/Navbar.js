import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5006/api';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await axios.get(`${API}/messages/unread/count`);
      setUnread(res.data.unread);
    } catch (err) {
      // Silently fail
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        🔥 Flicker
      </div>
      <div className="nav-links">
        <button
          className={`nav-btn ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <FiHome />
          <span>Discover</span>
        </button>
        <button
          className={`nav-btn ${isActive('/matches') ? 'active' : ''}`}
          onClick={() => navigate('/matches')}
        >
          <FiHeart />
          <span>Matches</span>
          {unread > 0 && <span className="badge">{unread}</span>}
        </button>
        <button
          className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <FiUser />
          <span>Profile</span>
        </button>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}