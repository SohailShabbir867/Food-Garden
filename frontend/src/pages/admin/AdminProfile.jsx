import React from 'react';
import ProfileForm from '../../components/shared/ProfileForm';

const AdminProfile = () => {
  return (
    <div className="py-4">
      <div className="max-w-3xl mx-auto mb-6 text-center sm:text-left">
        <h1 className="text-primary text-2xl sm:text-3xl font-black tracking-tight">Admin Profile</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your administrator account settings.</p>
      </div>
      <ProfileForm />
    </div>
  );
};

export default AdminProfile;
