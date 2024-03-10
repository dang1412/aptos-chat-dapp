import { useEffect, useState } from 'react'

interface Message {
  content: string
  isSelf: boolean
}

export function useMessages(friendId: number): Message[] {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // init messages when first select to connect
    setMessages([
      {content: 'Hello', isSelf: false},
      {content: 'Hello 123', isSelf: true},
      {content: 'Hello, how are you?', isSelf: false},
    ])
  }, [friendId])

  return messages
}
