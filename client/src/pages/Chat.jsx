import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import ChatSidebar from '../components/ChatSidebar'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import Navbar from '../components/Navbar'
import axios from 'axios'

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const { socket, onlineUsers, typingUsers } = useSocket()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message])
      })

      socket.on('message_sent', (message) => {
        setMessages(prev => [...prev, message])
      })

      return () => {
        socket.off('receive_message')
        socket.off('message_sent')
      }
    }
  }, [socket])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/all')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`/api/messages/${userId}`)
      setMessages(response.data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser)
    fetchMessages(selectedUser.id)
  }

  const handleSendMessage = (message) => {
    if (selectedUser && socket) {
      socket.emit('send_message', {
        receiverId: selectedUser.id,
        message
      })
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="flex h-[calc(100vh-64px)]">
        <ChatSidebar
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          onlineUsers={onlineUsers}
        />
        
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    {onlineUsers.has(selectedUser.id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedUser.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {onlineUsers.has(selectedUser.id) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              
              <MessageList
                messages={messages}
                currentUserId={user.id}
                selectedUser={selectedUser}
                typingUsers={typingUsers}
              />
              
              <MessageInput
                onSendMessage={handleSendMessage}
                selectedUser={selectedUser}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Welcome to ChatVerse
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a user from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
