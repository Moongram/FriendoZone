import React, { useState } from 'react';

const ProfileHeader = ({navigate, userData}) => {
    const goToMain = () => {
        navigate('/main', { state: { userData } });
      };
   
    
    return (
    <div className="main-header">
        <h1>Profile Page</h1>
        <div className='header-buttons'>
            <div className='profile-to-main'>
                <button type="button" onClick={goToMain}>Main</button>
            </div>
        </div>
    </div>
    )
}
export default ProfileHeader;