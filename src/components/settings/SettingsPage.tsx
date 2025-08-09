import React, { useState } from 'react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { Sidebar } from '../dashboard/Sidebar';
import { UserCircle, CheckCircle, Sun, Moon, Bell, Shield, Globe, Database, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';



export const SettingsPage: React.FC = () => {

  // Theme context
  const { isDarkMode, toggleTheme } = useTheme();

  // Tabs and state
  const [activeTab, setActiveTab] = useState('profile');
  const [saveLoading, setSaveLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Settings sidebar sections
  const settingSections = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Account info & preferences',
      icon: UserCircle,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme & display',
      icon: Sun,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts & updates',
      icon: Bell,
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Passwords & authentication',
      icon: Shield,
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect with external services',
      icon: Globe,
    },
    {
      id: 'data',
      title: 'Data Settings',
      description: 'Manage data preferences',
      icon: Database,
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Technical configurations',
      icon: SettingsIcon,
    },
  ];

  // Profile tab content
  const renderProfile = () => (
    <div className="space-y-6">
      {profileSuccess && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-300">Profile updated successfully!</span>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Information</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Update your account information and preferences</p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="+1 (123) 456-7890"
              />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => {
                setSaveLoading(true);
                setTimeout(() => {
                  setSaveLoading(false);
                  setProfileSuccess(true);
                  setTimeout(() => setProfileSuccess(false), 3000);
                }, 1000);
              }}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Appearance</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Manage your theme and display preferences</p>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <h4 className="text-md font-medium text-slate-900 dark:text-white mb-4">Theme Mode</h4>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  onClick={() => isDarkMode && toggleTheme()}
                  className={`p-4 rounded-lg border ${!isDarkMode 
                    ? 'border-blue-500 ring-2 ring-blue-400 bg-white' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'} 
                    flex flex-col items-center justify-center transition-all`}
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Sun className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">Light Mode</span>
                </button>
                
                <button
                  onClick={() => !isDarkMode && toggleTheme()}
                  className={`p-4 rounded-lg border ${isDarkMode 
                    ? 'border-blue-500 ring-2 ring-blue-400 dark:bg-slate-800' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'} 
                    flex flex-col items-center justify-center transition-all`}
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Moon className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">Dark Mode</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-slate-900 dark:text-white mb-4">Display Density</h4>
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200">
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Save Preferences
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
      case 'appearance':
        return renderAppearance();
      default:
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Coming Soon</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">This feature is currently under development</p>
            </div>
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <SettingsIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-2">This section is under development</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Check back soon for updates</p>
              </div>
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
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                        }`}
                      >
                        <section.icon className={`w-5 h-5 ${activeTab === section.id ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                        <div>
                          <p className={`font-medium text-sm ${activeTab === section.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>{section.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{section.description}</p>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">{renderTabContent()}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
