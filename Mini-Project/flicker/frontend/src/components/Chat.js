import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5006/api';

export default function Chat() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchUser, setMatchUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchMatchInfo();
    fetchMessages();

    intervalRef.current = setInterval(fetchMessages, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMatchInfo = async () => {
    try {
      const res = await axios.get(`${API}/matches`);
      const match = res.data.find(m => m.match_id === parseInt(matchId));
      if (match) {
        setMatchUser(match);
      }
    } catch (err) {
      console.error('Error fetching match info:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages/${matchId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${API}/messages/${matchId}`, {
        content: newMessage.trim()
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="chat-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/matches')}>
          <FiArrowLeft />
        </button>
        <img
          src={matchUser?.photo_url || `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=40&name=${matchUser?.name || 'U'}`}
          alt={matchUser?.name}
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=40&name=${matchUser?.name || 'U'}`; }}
        />
        <h3>{matchUser?.name || 'Chat'}</h3>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="emoji">👋</div>
            <p>Say hello to {matchUser?.name}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === user.id;
            return (
              <div key={msg.id} className={`message ${isMine ? 'sent' : 'received'}`}>
                <p>{msg.content}</p>
                <span className="time">{formatTime(msg.created_at)}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={!newMessage.trim()}>
          <FiSend />
        </button>
      </form>
    </div>
  );
}