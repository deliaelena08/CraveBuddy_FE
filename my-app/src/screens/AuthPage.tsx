import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Welcome/Welcome.css'; 

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <section>
      <div className="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="content">
        <h1>Choose an option</h1>
        <div className="button-group">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
