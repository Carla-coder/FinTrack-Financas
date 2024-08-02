import React from 'react';
import Title from '../components/Title';
import './Profile';

const Profile = () => {
  return (
    <div>
      <Title name="Profile" />
      <div className="container">
        <form className="form-profile">
          <label>Username:</label>
          <input type="text" value="John Doe" readOnly />
          <label>Email:</label>
          <input type="email" value="john@example.com" readOnly />
          <label>Address:</label>
          <textarea rows="4" readOnly>123 Main St, Anytown, USA</textarea>
          <button type="button">Edit Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
