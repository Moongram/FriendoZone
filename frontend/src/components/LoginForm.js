import React, { useState, useEffect } from 'react';
import userDataTest from '../users.json'
import axios from 'axios';

const LoginForm = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState(userDataTest);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

 

  const validate = (event) => {
    if (users.length === 0) {
      setUsers(userDataTest)
    }
    event.preventDefault();
    setErrorMessage('');

    const backendUserData = {
      username: username,
      password: password
    }
    axios.post('https://lily-social-app-7e0ca4e6d236.herokuapp.com/login', backendUserData, { withCredentials: true })
    .then(response => {
      if (response.data.result === 'success') {
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
        const username = response.data.username; 
        return axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/profile/${username}`, { withCredentials: true });
      } else {
        setIsLoggedIn(false);
        setErrorMessage('Invalid username or password!');
        return Promise.reject('Login failed');
      }
    })
    .then(profileResponse => {
      const userProfile = profileResponse.data;
      const userData = {
        id: userProfile.username,
        username: userProfile.username,
        displayName: userProfile.displayname,
        email: userProfile.email,
        phone: userProfile.phone,
        company: { catchPhrase: userProfile.headline },
        address: { zipcode: userProfile.zipcode, street: password }
      }
      navigate('/main', { state: { userData: userData } });
    })
    .catch(error => {
      if (error !== 'Login failed') {
        setErrorMessage(error.response?.data?.message || 'Error during profile fetch');
      }
    });
  };

  return (
    <div className="login-form" >
      <h2>User Login Form</h2>
      <form id="login" data-testid="login-form-1" onSubmit={validate}>
        <p>Username: <input type="text" autoComplete="off" name="account" data-testid="Username" required onChange={(e) => setUsername(e.target.value)} /></p>
        <p>Password: <input type="password" autoComplete="off" name="password" data-testid="Password" required onChange={(e) => setPassword(e.target.value)} /></p>
        <div className="button-container">
          <input type="submit" value="Login" data-testid="login-button"/>
        </div>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isLoggedIn && <p>Welcome, User!</p>}
    </div>
  );
};

export default LoginForm;
