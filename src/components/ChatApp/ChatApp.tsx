'use client'

import React, { useCallback, useState } from 'react'
import { Layout, List, Input, Button, Avatar } from 'antd'
import { MessageOutlined, SendOutlined } from '@ant-design/icons'

import { useMessages } from '@/hooks'
import { ChatService } from '@/services'
import { ManualOffer } from './ManualOffer'
import { ManualAnswer } from './ManualAnswer'

const { Sider, Content } = Layout

const ChatApp = () => {

  const messages = useMessages(1)

  const [msg, setMsg] = useState('')

  const sendMsg = useCallback(() => {
    const chatService = ChatService.getInstance()
    chatService.sendMessage(msg)
    setMsg('')
  }, [msg])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} theme="dark">
        {/* List of contacts or chat rooms */}
        <List
          dataSource={['Friend 1']}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<MessageOutlined />} />}
                title={<span style={{ color: 'white' }}>{item}</span>}
              />
            </List.Item>
          )}
        />

        <ManualOffer />

        <ManualAnswer />
        
        {/* <hr style={{margin: '10px 0'}} /> */}

        
      </Sider>
      <Layout>
        <Content style={{ padding: '20px' }}>
          {/* Chat area */}
          <List
            dataSource={messages}
            renderItem={message => (
              <div style={{
                display: 'flex',
                justifyContent: message.self ? 'flex-end' : 'flex-start',
                marginBottom: 10,
              }}>
                {!message.self && <Avatar style={{ backgroundColor: '#f56a00' }}>F</Avatar>}
                <div style={{
                  maxWidth: '60%',
                  background: message.self ? '#e6f7ff' : '#f6ffed',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  margin: message.self ? '0 0 0 10px' : '0 10px 0 0',
                  textAlign: 'left',
                  display: 'inline-block', // Ensure the bubble size fits the content
                }}>
                  <p style={{ margin: 0 }}>{message.content}</p>
                </div>
                {message.self && <Avatar style={{ backgroundColor: '#87d068' }}>S</Avatar>}
              </div>
            )}
          />
          {/* Message input */}
          <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '10px' }}>
            <Input
              addonAfter={
                <Button type="primary" onClick={sendMsg} icon={<SendOutlined />} />
              }
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message here..."
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ChatApp
