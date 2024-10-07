import React from 'react';

const SocialLinks = () => {
  return (
    <div style={{ marginTop: '30px' }}>
      <a href="https://github.com/YusefB" target="_blank" rel="noopener noreferrer">
        <img src="/assets/github.png" alt="GitHub" style={{ width: '50px', margin: '10px' }} />
      </a>
      <a href="https://www.linkedin.com/in/yusefbayyat/" target="_blank" rel="noopener noreferrer">
        <img src="/assets/linkedin.png" alt="LinkedIn" style={{ width: '50px', margin: '10px' }} />
      </a>
      <a href="/assets/resume.pdf" target="_blank" rel="noopener noreferrer">
        <img src="/assets/resume-icon.png" alt="Resume" style={{ width: '50px', margin: '10px' }} />
      </a>
    </div>
  );
};

export default SocialLinks;
