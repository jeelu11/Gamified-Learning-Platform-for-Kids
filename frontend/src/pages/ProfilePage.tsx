import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-kid-header text-primary-blue mb-8 text-center">
          👤 My Profile
        </h1>
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👦</div>
            <h2 className="text-2xl font-bold font-kid-header text-primary-blue">
              Super Learner
            </h2>
            <p className="text-gray-600 font-kid-body">student@eduplay.com</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold font-kid-header text-primary-green mb-4">
                🎮 Game Preferences
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="font-kid-body">Sound Effects</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="font-kid-body">Music</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="font-kid-body">Notifications</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-bold font-kid-header text-primary-orange mb-4">
                🔒 Account Settings
              </h3>
              <div className="space-y-2">
                <button className="btn-primary w-full">Change Password</button>
                <button className="btn-success w-full">Update Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;