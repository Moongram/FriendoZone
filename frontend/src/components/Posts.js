import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Posts = ({ post, loggedInUser}) => {
  const [showComments, setShowComments] = useState(true); 

  const [comments, setComments] = useState([]); 
  const [showInput, setShowInput] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [postContent, setPostContent] = useState(post.text);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);

  const selectCommentForEditing = (commentId) => {
    setCurrentAction('editComment');
    setSelectedCommentId(commentId);
    toggleInputBox();
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
    setShowInput(false); 
  };
  const toggleInputBox = () => {
    setShowInput(!showInput);
    setErrorMessage(''); 
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); 
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/articles/${post.pid}`, { withCredentials: true });
      const comments = response.data.articles[0].comments;
      setComments(comments);
    } catch (_error) {}
  }
  const onComment = (pid) => {
    setCurrentAction('leaveComment');
    toggleInputBox();


      }
  const onEditPost = (pid) => {
    setCurrentAction('editPost');
    toggleInputBox();

    

  }
  const onEditComment = (pid) => {
    setCurrentAction('editComment');
    toggleInputBox();
  }
    useEffect(() => {
    fetchComments();
  }, [post.pid, refreshComments]);
  const handleSubmit = async () => {
    toggleInputBox(); 
  
    switch (currentAction) {
      case 'leaveComment':
        axios.put(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/articles/${post.pid}`, { text: inputMessage, commentId: -1 }, { withCredentials: true })
        .then(response => {
          if (response.data.articles.length >0) {
            fetchComments();
          } 
        }).catch(_error => {} ); 
        setRefreshComments(prev => !prev); 
        break;
      case 'editPost':
        axios.put(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/articles/${post.pid}`, { text: inputMessage }, { withCredentials: true })
        .then(response => {
          const updatedPost = response.data.articles[0];
          setPostContent(updatedPost.text); 
        })
        .catch(error => {
          if (error.response && error.response.status === 403) {
            setErrorMessage('You are not authorized to edit this post.');
          }
        });

        break;
      case 'editComment':
        axios.put(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/articles/${post.pid}`, { text: inputMessage, commentId: selectedCommentId }, { withCredentials: true })
        .then(response => {
          const updatedPost = response.data.articles[0];
          const updatedComments = updatedPost.comments;
          setComments(updatedComments);
        })
        .catch(_error => {});
        break;
      default:
        break;
    }
  
    setCurrentAction('');
  };
  
  return (
    <div className="post-container">
      <div className="post-author">Author: {post.author}</div>
      <div className="post-timestamp">Posted on: {formatDate(post.date)}</div>
      <div className="post-body">{postContent}</div>
      <div className="post-image">
        {post.image && <img src={post.image} alt="Post"/>}
      </div>
      {showComments && (
        <div className="comments-section">
          <h4>Comments</h4>
          <ul>
            {comments && comments.map((comment) => (
              <li key={comment.id}>
                {comment.author}: {comment.message}
                {comment.author === loggedInUser && (
                  <button className="edit-comment-button" onClick={() => selectCommentForEditing(comment.id)}>Edit</button>
                )}</li>
            ))}
          </ul>

        </div>
      )}
      <div className="post-buttons">
        <button className="post-button" onClick={onComment}>Leave a Comment</button>
        <button className="post-button" onClick={onEditPost}>Edit Post</button>
        <button className="post-button" onClick={toggleComments}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>
      {showInput && (
        <div className="input-container">
          <textarea className="input-box"  onChange={(e) => setInputMessage(e.target.value)}/>
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      )}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

    </div>
  );
};

export default Posts;


