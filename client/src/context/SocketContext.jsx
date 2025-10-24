import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [typingUsers, setTypingUsers] = useState(new Map())
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Get token from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      
      const token = getCookie('token');
      
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        withCredentials: true,
        extraHeaders: {
          'Cookie': document.cookie
        }
      })

      newSocket.on('connect', () => {
        console.log('✅ Connected to server with socket:', newSocket.id)
        setSocket(newSocket)
      })

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error)
      })

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from server:', reason)
      })

      // Receive full online users list
      newSocket.on('online_users', (userIds) => {
        setOnlineUsers(new Set(userIds))
      })

      // Backwards compatibility with single-user events
      newSocket.on('user_online', (data) => {
        setOnlineUsers(prev => new Set([...prev, data.userId]))
      })

      newSocket.on('user_offline', (data) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      })

      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev)
          if (data.isTyping) {
            newMap.set(data.userId, data.username)
          } else {
            newMap.delete(data.userId)
          }
          return newMap
        })
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server')
      })

      return () => {
        newSocket.close()
        setSocket(null)
      }
    }
  }, [user])

  const sendMessage = (receiverId, message) => {
    if (socket) {
      socket.emit('send_message', { receiverId, message })
    }
  }

  const startTyping = (receiverId) => {
    if (socket) {
      socket.emit('typing_start', { receiverId })
    }
  }

  const stopTyping = (receiverId) => {
    if (socket) {
      socket.emit('typing_stop', { receiverId })
    }
  }

  const value = {
    socket,
    onlineUsers,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
