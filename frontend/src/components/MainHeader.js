import React, { useState } from 'react';
import axios from 'axios';

const MainHeader = ({navigate, userData}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); 

    const goToProfile = () => {
        navigate('/profile', { state: { userData } });
      };

    const logout = () => {
        axios.put('https://lily-social-app-7e0ca4e6d236.herokuapp.com/logout', {}, { withCredentials: true })
        .then(_response => {
            setIsLoggedIn(false);
            navigate('/');
        })
        .catch(_error => {});
    };
    
    
    return (
    <div className="main-header">
        <h1>Main Page</h1>
        <div className='header-buttons'>
            <div className='main-to-profile'>
                <button type="button" onClick={goToProfile}>Profile</button>
            </div>
            <div className='main-to-landing'>
                <button type="button" onClick={logout} data-testid="logout-button">Logout</button>
            </div>
        </div>
        {!isLoggedIn && <p>logout state true</p>}

    </div>
    
    )
}
export default MainHeader;
