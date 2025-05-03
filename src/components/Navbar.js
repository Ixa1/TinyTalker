import React from 'react';

const Navbar = ({ language, setLanguage }) => (
  <div className="navbar">
    <button className="guidebook">Guidebook</button>
    <div className="user-info">
      <span onClick={() => setLanguage((prev) => (prev === 'US' ? 'NP' : 'US'))}>
        {language}
      </span>
      <span>❤️ 5</span>
    </div>
  </div>
);

export default Navbar;
