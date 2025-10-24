import { useState, useRef, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'

const MessageInput = ({ onSendMessage, selectedUser }) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const { startTyping, stopTyping } = useSocket()

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && selectedUser) {
      onSendMessage(message.trim())
      setMessage('')
      stopTyping(selectedUser.id)
      setIsTyping(false)
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)

    if (selectedUser) {
      if (!isTyping) {
        setIsTyping(true)
        startTyping(selectedUser.id)
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedUser.id)
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Message ${selectedUser?.username || 'user'}...`}
            className="input w-full"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!selectedUser}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || !selectedUser}
          className="btn btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default MessageInput
