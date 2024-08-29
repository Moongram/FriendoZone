import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = ({navigate}) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [dob, setDob] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [displayName, setDisplayName] = useState('');

  const validate = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmation) {
      setErrorMessage('Password confirmation does not match password');
      return;
    }

    const birthDate = new Date(dob);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    if (birthDate > eighteenYearsAgo) {
      setErrorMessage('Only individuals 18 years of age or older on the day of registration are allowed to register.');
      return;
    }

    const userData = {
        id: username,
        username: username,
        displayName: displayName,
        email: email,
        phone: phone,
        company: { catchPhrase: 'Hi you!' },
        address: { street: password, zipcode: zip }
      };
    const backendUserData = {
      username: username,
      displayname: displayName,
      email: email,
      phone: phone,
      zipcode: zip,
      dob: new Date(dob).getTime(), 
      password: password
    }
    const backendUserDataLogin = {
      username: username,
      password: password
    }
    axios.post('https://lily-social-app-7e0ca4e6d236.herokuapp.com/register', backendUserData, { withCredentials: true })
     .then(response => {
       if (!response.data.result === 'success') {
        setErrorMessage('Registration failed');
      }})
     .catch(error => {
       setErrorMessage(error.response?.data?.message || 'Error during registration');
     }).then(() => {

     axios.post('https://lily-social-app-7e0ca4e6d236.herokuapp.com/login', backendUserDataLogin, { withCredentials: true })
    .then(response => {
      if (response.data.result === 'success') {
        navigate('/main', { state: { userData: userData } });
      } else {
        setErrorMessage('Invalid username or password!');
        return Promise.reject('Login failed');
      }
    }).catch(error => {
      if (error !== 'Login failed') {
        setErrorMessage(error.response?.data?.message || 'Error during profile fetch');
      }
    });
  });
  };

  return (
    <div className="registration-form">
      <h2>User Registration Form</h2>
      <form id="registration" onSubmit={validate}>
        <p>Account Name: <input type="text" name="account" required pattern="[a-zA-Z][a-zA-Z0-9]*" onChange={(e) => setUsername(e.target.value)}/></p>
        <p>Display Name (Optional): <input type="text" name="display"onChange={(e) => setDisplayName(e.target.value)}/></p>
        <p>Email Address: <input type="email" name="email" required onChange={(e) => setEmail(e.target.value)}/></p>
        <p>Phone Number: <input type="tel" name="phone" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={(e) => setPhone(e.target.value)}/></p>
        <p>Date of Birth: <input type="date" name="dob" required onChange={(e) => setDob(e.target.value)} /></p>
        <p>Zipcode: <input type="text" name="zipcode" required pattern="[0-9]{5}" onChange={(e) => setZip(e.target.value)}/></p>
        <p>Password: <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)} /></p>
        <p>Password Confirmation: <input type="password" name="confirmation" required onChange={(e) => setConfirmation(e.target.value)} /></p>
        <div className="button-container">
            <input type="submit" value="Register" />
        </div>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default RegistrationForm;
