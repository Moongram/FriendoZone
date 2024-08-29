import React, { useState, useEffect, useRef } from "react";
import ProfileHeader from '../components/ProfileHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
const navigate = useNavigate();
const location = useLocation();
const [avatarUrl, setAvatarUrl] = useState('');

const userData = location.state.userData;
const [image, setImage] = useState(null);
const fileInputRef = useRef();

const handleUpdateAvatar = () => {

  
  const formData = new FormData();
  formData.append('image', image);
  


  axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/avatar', formData, { withCredentials: true })
  .then(response => {
    setAvatarUrl(response.data.avatar);
    setImage(null);
    fileInputRef.current.value = '';
  }).catch(_error => {});
};

const handleUpdateDisplayName = () => {
  axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/displayname', { displayname: name }, { withCredentials: true })
  .then(_response => {}).catch(_error => {});
}

const handleUpdateEmail = () => {
  axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/email', { email: email }, { withCredentials: true })
  .then(_response => {}).catch(_error => {});
}

const handleUpdatePhone = () => {
  axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/phone', { phone: phone }, { withCredentials: true })
  .then(_response => {}).catch(_error => {});
}

const handleUpdateZip = () => {
  axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/zipcode', { zipcode: zip }, { withCredentials: true })
  .then(_response => {}).catch(_error => {});
}

const handleUpdatePassword = () => {
  axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/password', { password: password }, { withCredentials: true })
  .then(_response => {}).catch(_error => {});
}

const fetchAvatar = async () => {
  try {
    const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/avatar/${userData.username}`, { withCredentials: true });
    setAvatarUrl(response.data.avatar);
  } catch (_error) {}
};

const fetchDisplayName = async () => {
  try {
    const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/displayname/${userData.username}`, { withCredentials: true });
    setCurName(response.data.displayname);
  } catch (_error) {}
}

const fetchEmail = async () => {
  try {
    const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/email/${userData.username}`, { withCredentials: true });
    setCurEmail(response.data.email);
  } catch (_error) {}
}

const fetchPhone = async () => {
  try {
    const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/phone/${userData.username}`, { withCredentials: true });
    setCurPhone(response.data.phone);
  } catch (_error) {}
}

const fetchZip = async () => {
  try {
    const response = await axios.get(`https://lily-social-app-7e0ca4e6d236.herokuapp.com/zipcode/${userData.username}`, { withCredentials: true });
    setCurZip(response.data.zipcode);
  } catch (_error) {}
}


useEffect(() => {
  fetchAvatar();
  fetchDisplayName();
  fetchEmail();
  fetchPhone();
  fetchZip();

}, [userData.username]); 


  const [curName, setCurName] = useState(userData.displayName);
  const [curEmail, setCurEmail] = useState(userData.email);
  const [curPhone, setCurPhone] = useState(userData.phone);
  const [curZip, setCurZip] = useState(userData.address.zipcode);
  const [curPassword, setCurPassword] = useState('*'.repeat(userData.address.street.length));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameMessage, setNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [zipMessage, setZipMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");

  const validate = () => {
    if (name !== "") {
      if (name === curName) {
        setNameMessage("Please provide a different value for updating your profile information.");
      } else {
        setNameMessage("");
        setCurName(name);
        handleUpdateDisplayName();
      }
    } else {
        setNameMessage("")
    }
    if (email !== "") {
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (!emailPattern.test(email)) {
        setEmailMessage("Please enter a valid email address.");
      } else if (email === curEmail) {
        setEmailMessage("Please provide a different value for updating your email.");
      } else {
        setEmailMessage("");
        setCurEmail(email);
        handleUpdateEmail();
      }
    } else {
        setEmailMessage("")
    }

    if (phone !== "") {
      const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      if (!phonePattern.test(phone)) {
        setPhoneMessage("Please enter a valid phone number in 123-123-1234 format.");
      } else if (phone === curPhone) {
        setPhoneMessage("Please provide a different value for updating your phone number.");
      } else {
        setPhoneMessage("");
        setCurPhone(phone);
        handleUpdatePhone();
      }
    } else {
        setPhoneMessage("")
    }

    if (zip !== "") {
      const zipPattern = /^[0-9]{5}$/;
      if (!zipPattern.test(zip)) {
        setZipMessage("Please enter a valid 5-digit US zip code.");
      } else if (zip === curZip) {
        setZipMessage("Please provide a different value for updating your zip code.");
      } else {
        setZipMessage("");
        setCurZip(zip);
        handleUpdateZip();
      }
    } else {
        setZipMessage("")
    }

    if (password !== "") {
      if (password !== confirmPassword) {
        setPasswordMessage("Password and confirmation do not match.");
      } else if (password === curPassword) {
        setPasswordMessage("Please provide a different value for updating your password.");
      } else {
        setPasswordMessage("");
        setCurPassword(password);
        userData.address.street = password;
        handleUpdatePassword();
      }
    } else {
        setPasswordMessage("");
    }

    setName("");
    setEmail("");
    setPhone("");
    setZip("");
    setPassword("");
    setConfirmPassword("");

  };

  return (
    <div className="container">
      <ProfileHeader navigate={navigate} userData={userData}/>
      <div className="profile-picture-container">
        <img src={avatarUrl}></img>

        <input className="post-button"
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        ref={fileInputRef} 
      />
        <button onClick={handleUpdateAvatar} className="post-button">Update Profile Picture</button>

        </div>
      <table className="styled-table" id="pf">
        <thead>
          <tr className="table-key">
            <th>Key</th>
            <th>Input</th>
            <th>Value</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="key">Display Name</td>
            <td><input type="text" className="field" value={name} onChange={(e) => setName(e.target.value)} /></td>
            <td className="hc" id="dis-name">{curName}</td>
            <td id="msg-name">{nameMessage}</td>
          </tr>
          <tr>
            <td className="key">Email Address</td>
            <td><input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></td>
            <td className="hc" id="dis-email">{curEmail}</td>
            <td id="msg-email">{emailMessage}</td>
          </tr>
          <tr>
            <td className="key">Phone Number</td>
            <td><input type="tel" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} /></td>
            <td className="hc" id="dis-phone">{curPhone}</td>
            <td id="msg-phone">{phoneMessage}</td>
          </tr>
          <tr>
            <td className="key">Zip Code</td>
            <td><input type="text" className="field" value={zip} onChange={(e) => setZip(e.target.value)} /></td>
            <td className="hc" id="dis-zip">{curZip}</td>
            <td id="msg-zip">{zipMessage}</td>
          </tr>
          <tr>
            <td className="key">Password</td>
            <td><input type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} /></td>
            <td className="hc" id="dis-password">{"*".repeat(curPassword.length)}</td>
            <td id="msg-password">{passwordMessage}</td>
          </tr>
          <tr>
            <td className="key">Password Confirmation</td>
            <td><input type="password" className="field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></td>
            <td className="hc" id="dis-confirm">{"*".repeat(curPassword.length)}</td>
            <td id="msg-confirm">{confirmPasswordMessage}</td>
          </tr>
        </tbody>
      </table>
      <div className="btn-container">
        <button onClick={validate}>Update</button>
      </div>
    </div>
  );
};

export default ProfilePage;
