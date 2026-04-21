import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiSave, FiCamera } from 'react-icons/fi';

const API = 'http://localhost:5006/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
    interested_in: user?.interested_in || '',
    photo_url: user?.photo_url || '',
    location: user?.location || ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await axios.put(`${API}/users/me`, formData);
      updateUser(res.data);
      setSuccess('Profile updated! 🎉');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>✏️ Edit Profile</h2>

      <div className="profile-photo-section">
        <img
          src={formData.photo_url || `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=120&name=${user?.name || 'U'}`}
          alt="Profile"
          className="profile-photo"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=ff6b6b&color=fff&size=120&name=${user?.name || 'U'}`; }}
        />
        <div className="form-group">
          <label><FiCamera /> Photo URL</label>
          <input
            type="text"
            name="photo_url"
            placeholder="https://example.com/photo.jpg"
            value={formData.photo_url}
            onChange={handleChange}
          />
        </div>
      </div>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min={18}
              max={100}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Interested In</label>
            <select name="interested_in" value={formData.interested_in} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Men</option>
              <option value="female">Women</option>
              <option value="everyone">Everyone</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            placeholder="Tell people about yourself..."
            value={formData.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}