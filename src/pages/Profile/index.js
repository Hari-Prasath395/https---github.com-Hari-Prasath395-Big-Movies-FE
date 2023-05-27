import React, { useState } from 'react';

import Bookings from './Bookings';

import TheatersList from './TheatersList';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h5 className="admin-heading px-2 pt-2">Profile</h5>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            Bookings
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

      {activeTab === 'bookings' && <Bookings/>}
      {activeTab === 'theaters' && <TheatersList />}
    </div>
  );
};

export default Profile;
