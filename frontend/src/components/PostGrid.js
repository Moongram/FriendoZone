import axios from 'axios';
import React, { useState, useRef } from 'react';

const PostGrid = ({ onPostSubmit, user }) => {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  
const handlePostSubmit = () => {
    const newPost = {
      id: Date.now(), 
      title: "Your New Post!",
      text: postText,
      author: user.username,
      date: new Date(),
      image: image ? URL.createObjectURL(image) : null 
    };
    
    const formData = new FormData();
    formData.append('text', postText);
    if (image) {
        formData.append('image', image);
    }

    axios.post('https://lily-social-app-7e0ca4e6d236.herokuapp.com/article', formData, { withCredentials: true })
    .then(response => {
      onPostSubmit(response.data.articles[0]);
    }).catch(_error => {});

    setPostText('');
    setImage(null);
    fileInputRef.current.value = ''; 
  };
  const handleClear = () => {
    setPostText('');
    setImage(null);
    fileInputRef.current.value = ''; 

  };

  return (
    <div className="post-grid">
      <input
        type="text"
        placeholder="Write your post..."
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className="post-input"
      />
      <input className="post-button"
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        ref={fileInputRef} 
      />
      <div className="post-button-container">
        <button onClick={handlePostSubmit} className="post-button">Post</button>
        <button onClick={handleClear} className="post-button">Clear</button>
      </div>

    </div>
  );
};

export default PostGrid;
