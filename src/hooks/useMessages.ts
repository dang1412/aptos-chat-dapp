import { useEffect, useState } from 'react'

import { Message } from '@/types'
import { ChatService } from '@/services'

export function useMessages(friendId: number): Message[] {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // init messages when first select to connect
    setMessages([
      {content: 'Hello', self: false},
      {content: 'Hello 123', self: true},
      {content: 'Hello, how are you?', self: false},
    ])

    const chatService = ChatService.getInstance()
    chatService.onMessage = (msg) => {
      setMessages(messages => [...messages, msg])
    }
  }, [friendId])

  return messages
}
