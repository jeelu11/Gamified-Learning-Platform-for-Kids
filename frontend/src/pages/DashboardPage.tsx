import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return <div className="min-h-screen bg-bg-light py-8">{renderDashboard()}</div>;
};

const StudentDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold font-kid-header text-primary-blue mb-8">
      Welcome back, Student! 👋
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-green mb-4">
          🎮 Continue Learning
        </h2>
        <p>Resume your latest game!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-orange mb-4">
          🏆 Your Progress
        </h2>
        <p>Check your achievements!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-purple mb-4">
          📊 Your Stats
        </h2>
        <p>View your learning statistics!</p>
      </div>
    </div>
  </div>
);

const ParentDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold font-kid-header text-primary-blue mb-8">
      Parent Dashboard 👨‍👩‍👧‍👦
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-green mb-4">
          👦 My Children
        </h2>
        <p>View and manage your children's accounts!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-orange mb-4">
          📈 Progress Reports
        </h2>
        <p>Monitor learning progress!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-purple mb-4">
          ⏰ Time Management
        </h2>
        <p>Set screen time limits!</p>
      </div>
    </div>
  </div>
);

const TeacherDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold font-kid-header text-primary-blue mb-8">
      Teacher Dashboard 👩‍🏫
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-green mb-4">
          🏫 My Classes
        </h2>
        <p>Manage your classrooms!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-orange mb-4">
          📊 Student Analytics
        </h2>
        <p>View student performance!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-purple mb-4">
          📝 Assignments
        </h2>
        <p>Create and manage assignments!</p>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold font-kid-header text-primary-blue mb-8">
      Admin Dashboard 👨‍💼
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-green mb-4">
          👥 User Management
        </h2>
        <p>Manage all users!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-orange mb-4">
          📊 Platform Analytics
        </h2>
        <p>View platform statistics!</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold font-kid-header text-primary-purple mb-4">
          🎮 Content Management
        </h2>
        <p>Manage games and content!</p>
      </div>
    </div>
  </div>
);

export default DashboardPage;