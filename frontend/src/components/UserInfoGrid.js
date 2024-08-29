import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserInfoGrid = ({ user, onUpdateStatus }) => {

  const [status, setStatus] = useState("");

  const [newStatus, setNewStatus] = useState('');

    const [avatarUrl, setAvatarUrl] = useState('');
    const [displayName, setDisplayName] = useState('');

  const fetchHeadline = async () => {
    try {
      const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/headline/${user.username}`, { withCredentials: true });
      setStatus(response.data.headline);
    } catch (_error) {}
  };

  const fetchDisplayName = async () => {
    try {
      const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/displayname/${user.username}`, { withCredentials: true });
      setDisplayName(response.data.displayname);
    } catch (_error) {}
  }

  const fetchAvatar = async () => {
    try {
      const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/avatar/${user.username}`, { withCredentials: true });
      setAvatarUrl(response.data.avatar);
    } catch (_error) {}};

  useEffect(() => {
    fetchHeadline();
    fetchAvatar();
    fetchDisplayName();
  }, [user.username]); 

  const handleStatusUpdate = () => {
    if (newStatus.trim() !== '') {
      onUpdateStatus(newStatus);
      setStatus(newStatus);
      setNewStatus('');
      axios.put(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/headline`, { headline: newStatus }, { withCredentials: true })
      .then(_response => {})
    }

  };

  return (
    <div className="user-info-grid">
      <div>
        <h3>{displayName}</h3>
        <img src={avatarUrl}></img>
      </div>
      <p className="status">{status}</p>
      <div>
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="post-input"
        />
        <button onClick={handleStatusUpdate} className="post-button">
          Update Status
        </button>
      </div>
    </div>
  );
};

export default UserInfoGrid;

