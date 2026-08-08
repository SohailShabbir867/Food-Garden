import React from 'react';
import ProfileForm from '../../components/shared/ProfileForm';

const Profile = () => {
  return (
    <div className="pt-24 pb-8 px-4">
      <div className="max-w-3xl mx-auto mb-6 text-center sm:text-left">
        <h1 className="text-primary text-2xl sm:text-3xl font-black tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your personal information and preferences.</p>
      </div>
      <ProfileForm />
    </div>
  );
};

export default Profile;
