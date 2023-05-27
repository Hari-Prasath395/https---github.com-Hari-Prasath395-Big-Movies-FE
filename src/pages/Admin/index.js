import React, { useState } from 'react';
import Movies from './MoviesList';
import Theaters from './TheatersList';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('movies');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h5 className="admin-heading px-2 pt-2">Admin</h5>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => handleTabChange('movies')}
          >
            Movies
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 'theaters' ? 'active' : ''}`}
            onClick={() => handleTabChange('theaters')}
          >
            Theaters
          </button>
        </li>
      </ul>

      {activeTab === 'movies' && <Movies />}
      {activeTab === 'theaters' && <Theaters />}
    </div>
  );
};

export default Admin;
