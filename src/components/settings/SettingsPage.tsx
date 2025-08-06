import React, { useState } from 'react'
import { DashboardHeader } from '../dashboard/DashboardHeader'
import { Sidebar } from '../dashboard/Sidebar'
import { User, Bell, Shield, Database, Globe, Key, Mail, CheckCircle } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export const SettingsPage: React.FC = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    weekly: true,
    monthly: true
  })
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || 'Demo',
    lastName: user?.lastName || 'User',
    email: user?.emailAddresses[0]?.emailAddress || 'demo@datasculpt.com',
    phone: '+91 98765 43210'
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [showMfaSetup, setShowMfaSetup] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  
  // Success/Error states
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [mfaSuccess, setMfaSuccess] = useState(false)

  const settingSections: SettingSection[] = [
    { id: 'profile', title: 'Profile Settings', description: 'Manage your account information', icon: User },
    { id: 'notifications', title: 'Notifications', description: 'Configure notification preferences', icon: Bell },
    { id: 'security', title: 'Security', description: 'Password and security settings', icon: Shield },
    { id: 'integrations', title: 'Integrations', description: 'Connect external services', icon: Database },
    { id: 'regional', title: 'Regional', description: 'Language and timezone settings', icon: Globe }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Profile updated successfully!</span>
              </div>
            )}
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Change Photo
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setProfileSuccess(true)
                      setTimeout(() => setProfileSuccess(false), 3000)
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">Email Notifications</p>
                      <p className="text-sm text-slate-600">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">Push Notifications</p>
                      <p className="text-sm text-slate-600">Receive browser notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-slate-900">SMS Notifications</p>
                      <p className="text-sm text-slate-600">Receive updates via SMS</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({...notifications, sms: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Frequency</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Weekly Reports</p>
                    <p className="text-sm text-slate-600">Receive weekly performance summaries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.weekly} onChange={(e) => setNotifications({...notifications, weekly: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Monthly Reports</p>
                    <p className="text-sm text-slate-600">Receive monthly detailed reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notifications.monthly} onChange={(e) => setNotifications({...notifications, monthly: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Password updated successfully!</span>
              </div>
            )}
            
            {mfaSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Two-factor authentication enabled successfully!</span>
              </div>
            )}
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Password Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      if (passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword.length >= 8) {
                        setPasswordSuccess(true)
                        setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''})
                        setTimeout(() => setPasswordSuccess(false), 3000)
                      }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Two-Factor Authentication</h3>
              <div className="space-y-4">
                {!mfaEnabled ? (
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-900">Enable 2FA</p>
                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowMfaSetup(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enable
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-900">2FA Enabled</p>
                        <p className="text-sm text-slate-600">Two-factor authentication is active</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setMfaEnabled(false)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Disable
                    </button>
                  </div>
                )}
                
                {showMfaSetup && (
                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <h4 className="font-medium text-slate-900 mb-3">Setup 2FA</h4>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600">Enter the 6-digit code from your authenticator app:</p>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="000000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            if (mfaCode.length === 6) {
                              setMfaEnabled(true)
                              setShowMfaSetup(false)
                              setMfaCode('')
                              setMfaSuccess(true)
                              setTimeout(() => setMfaSuccess(false), 3000)
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => {
                            setShowMfaSetup(false)
                            setMfaCode('')
                          }}
                          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Chrome on Windows</p>
                    <p className="text-sm text-slate-600">Last active: 2 minutes ago</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Current</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Safari on iPhone</p>
                    <p className="text-sm text-slate-600">Last active: 1 hour ago</p>
                  </div>
                  <button className="text-xs text-red-600 font-medium hover:text-red-700">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        )



      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Connected Services</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">PostgreSQL Database</p>
                      <p className="text-sm text-slate-600">Connected • Last sync: 2 min ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Disconnect
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">LUX API</p>
                      <p className="text-sm text-slate-600">Connected • Last sync: 5 min ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Disconnect
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Google Analytics</p>
                      <p className="text-sm text-slate-600">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'regional':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Regional Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Asia/Kolkata (UTC+5:30)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>Europe/London (UTC+0)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Indian Rupee (₹)</option>
                    <option>US Dollar ($)</option>
                    <option>Euro (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Settings</h1>
              <p className="text-slate-600">Manage your account preferences and configurations</p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <nav className="space-y-2">
                    {settingSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          activeTab === section.id
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <section.icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium text-sm">{section.title}</p>
                          <p className="text-xs text-slate-500">{section.description}</p>
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
  )
} 