import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import RegistrationForm from '../components/RegistrationForm'
import LoginForm from '../components/LoginForm'


const LandingPage = () => {
    const navigate = useNavigate(); 

    return (
        <div className='landing'>
            <div className="container">
                <div className="welcome">
                    <h2>Welcome to Friendo Zone</h2>
                </div>
                <div className="forms-container">
                    <RegistrationForm navigate={navigate}/>
                    <LoginForm navigate={navigate}/>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
