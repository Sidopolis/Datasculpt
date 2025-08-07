import React, { useState } from 'react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { Sidebar } from '../dashboard/Sidebar';
import { User, Bell, Shield, Database, Globe, Mail, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SettingsPage: React.FC = () => {
  const { user } = useUser();
  
  // Tab and loading states
  const [activeTab, setActiveTab] = useState('profile');
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || 'Hrithik',
    lastName: user?.lastName || 'Singh',
    email: user?.emailAddresses[0]?.emailAddress || 'hrithik@datasculpt.ai',
    phone: '+91 9876543210'
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: true,
    weekly: true,
    monthly: true,
    updates: true,
    security: true
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Security states
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  
  // Success/Error states
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [mfaSuccess, setMfaSuccess] = useState(false);

  const settingSections: SettingSection[] = [
    { id: 'profile', title: 'Profile Settings', description: 'Manage your account information', icon: User },
    { id: 'notifications', title: 'Notifications', description: 'Configure notification preferences', icon: Bell },
    { id: 'security', title: 'Security', description: 'Password and security settings', icon: Shield },
    { id: 'integrations', title: 'Integrations', description: 'Connect external services', icon: Database },
    { id: 'regional', title: 'Regional', description: 'Language and timezone settings', icon: Globe }
  ];

  const renderProfile = () => {
    return (
      <div className="space-y-6">
        {profileSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Profile updated successfully!</span>
          </div>
        )}
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
            <p className="text-sm text-slate-600 mt-1">Update your account information and preferences</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold shadow-lg transition-transform hover:scale-105">
                  {profileForm.firstName.charAt(0)}{profileForm.lastName.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-white text-sm">Change</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pl-10" 
                    placeholder="Enter your first name"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pl-10" 
                    placeholder="Enter your last name"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pl-10" 
                    placeholder="Enter your email"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pl-10" 
                    placeholder="Enter your phone number"
                  />
                  <Bell className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                onClick={() => {
                  setSaveLoading(true);
                  setTimeout(() => {
                    setProfileSuccess(true);
                    setSaveLoading(false);
                  }, 1000);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      default:
        return (
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-500">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Settings</h1>
              <p className="text-slate-600 dark:text-slate-300">Manage your account preferences and configurations</p>
            </div>
            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                  <nav className="space-y-2">
                    {settingSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          activeTab === section.id
                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <section.icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium text-sm">{section.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{section.description}</p>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              {/* Content */}
              <div className="lg:col-span-3">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
