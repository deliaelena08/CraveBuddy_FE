import React from 'react';
import './Welcome.css';

const Welcome: React.FC = () => {
  return (
    <section>
      <div className="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="content">
        <h1>Welcome to CraveBuddy</h1>
        <button>Get Started</button>
      </div>
    </section>
  );
};

export default Welcome;
