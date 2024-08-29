import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import Posts from '../components/Posts';
import UserInfoGrid from '../components/UserInfoGrid';
import PostGrid from '../components/PostGrid';
import axios from 'axios';
import Pagination from '../components/Pagination';
const MainPage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [newFollowerName, setNewFollowerName] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [currentPosts, setCurrentPosts] = useState([]);
  const location = useLocation();
  const userData = location.state.userData;
  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setCurrentPosts(userPosts.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, userPosts]);
  

 useEffect(() => {
  fetchUserPosts();
  fetchFollowers();
}, [userData.username]);
 const paginate = pageNumber => setCurrentPage(pageNumber);

 
 const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/articles`, { withCredentials: true });
      const articles = response.data.articles;
      if (articles.length === 0) {
        setUserPosts([]);
        return ([])
      } else {
      const sortedPosts = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserPosts(sortedPosts);
    }
 } catch (_error) {}
};

 const fetchFollowers = async () => {
  try {
      const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/following/${userData.username}`, { withCredentials: true });
      const usernames = response.data.following;
      if (usernames.length === 0) {
        setFollowedUsers([]);
        return ([])
      }
      const profiles = await Promise.all(
        usernames.map(username =>
            axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/profile/${username}`, { withCredentials: true })
                .then(res => res.data)
                .catch(_err => {
                    return null; 
                })
        )
    );
      setFollowedUsers(profiles);
      return profiles;
  } catch (_error) {}
};
 const handleAddFollower = async () => {
  if (newFollowerName == userData.username) {
    setErrorMessage("You cannot follow yourself.");  
    setNewFollowerName('');
    return;
  }
  try {
    const response = await axios.put(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/following/${newFollowerName}`, {}, { withCredentials: true });
    if (response.data.username == userData.username) {
      setErrorMessage("");  
      setNewFollowerName('');
      fetchFollowers();
      fetchUserPosts();
    } else {
      setNewFollowerName('');
      setErrorMessage("user not found.");
    }
  } catch (error) {
    setNewFollowerName('');
    setErrorMessage(error.response.data.message);
  };}

  const handleUnfollow = async username => {
    try {
      const response = await axios.delete(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/following/${username}`, { withCredentials: true });
      if (response.data.username === userData.username) {
         fetchFollowers();
         fetchUserPosts();
      }
    } catch (_error) {}
  };
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  };

  const handleComment = postId => {
  };

  const handleEditPost = postId => {
  
  };
  const handleEditComment = (postId) => {
  }

  const handlePostSubmit = newPost => {
    setUserPosts([newPost, ...userPosts]);
  };

  const handleStatusUpdate = newStatus => {

  };

  return (
    <div>
      <MainHeader navigate={navigate} userData={userData} />
      <div className="main-content">
        <UserInfoGrid user={userData} onUpdateStatus={handleStatusUpdate} />
        <PostGrid user={userData} onPostSubmit={handlePostSubmit} />
      </div>
      <div className="sidebar">
        <h2 className = "follow-user-h2">Followed Users</h2>
        <ul className="follow-user-ul">
          {followedUsers.map(user => (
            <li className='follow-user-li'key={user.id}>
              <img className='follow-user-img' src={user.avatar} alt="Avatar" />
              <p>{user.username}</p>
              <p>{user.headline}</p>

              <button data-testid={`unfollow-${user.username}`} onClick={() => handleUnfollow(user.username)}>Unfollow</button>
            </li>
          ))}
        </ul>
        <input className='se'
          type="text"
          data-testid='add-follower-name'
          placeholder="Enter name"
          value={newFollowerName}
          onChange={e => setNewFollowerName(e.target.value)}
        />
        <button data-testid='add-follower' onClick={handleAddFollower}>Add Follower</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      </div>
      <div className="search-bar">
        <input data-testid='search-test'
          type="text"
          placeholder="Search by author or text..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

    <div data-testid='user-posts'>
    {currentPosts.filter(post => {
        return post.author.toLowerCase().includes(searchQuery.toLowerCase()) || post.text.toLowerCase().includes(searchQuery.toLowerCase())
      }).map(post => (
      <Posts key={post.pid} post={post} loggedInUser={userData.username} />
    ))}
  </div>
  <Pagination
    postsPerPage={postsPerPage}
    totalPosts={userPosts.length}
    paginate={paginate}
  />
   
    </div>
  );
};

export default MainPage;

