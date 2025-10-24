import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'

const Settings = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('password')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    setError('')
    setMessage('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await axios.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion')
      return
    }

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      await axios.delete('/api/users/delete')
      logout()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings
            </p>
          </div>

          <div className="flex">
            <div className="w-64 border-r border-gray-200 dark:border-gray-700">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'password'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Change Password
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'account'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Account
                </button>
              </nav>
            </div>

            <div className="flex-1 p-6">
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        className="input mt-1"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="input mt-1"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="input mt-1"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    {message && (
                      <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary px-6 py-2"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Account Information
                    </h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {user?.username}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="deleteConfirm" className="block text-sm font-medium text-red-700 dark:text-red-300">
                            Type DELETE to confirm
                          </label>
                          <input
                            id="deleteConfirm"
                            type="text"
                            className="input mt-1"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            placeholder="DELETE"
                          />
                        </div>
                        
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading || deleteConfirm !== 'DELETE'}
                          className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Deleting...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
