import { useState } from 'react'

const ChatSidebar = ({ users, selectedUser, onUserSelect, onlineUsers }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contacts
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="input w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No users found
          </div>
        ) : (
          <div className="p-2">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUser?.id === user.id}
                isOnline={onlineUsers.has(user.id)}
                onClick={() => onUserSelect(user)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const UserCard = ({ user, isSelected, isOnline, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.bio || 'No bio available'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
