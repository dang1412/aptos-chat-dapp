'use client'

import React from 'react';
import { Layout, List, Input, Button, Avatar } from 'antd';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useMessages } from '@/hooks';

const { Sider, Content } = Layout;

// Sample messages
// const messages = [
//   { id: 1, author: "Friend", content: "Hey, how are you?", avatar: <Avatar style={{ backgroundColor: '#f56a00' }}>F</Avatar>, isSelf: false },
//   { id: 2, author: "Self", content: "I'm good, thanks! And you?", avatar: <Avatar style={{ backgroundColor: '#87d068' }}>S</Avatar>, isSelf: true },
//   { id: 3, author: "Friend", content: "Great to hear! I'm doing well, thanks for asking.", avatar: <Avatar style={{ backgroundColor: '#f56a00' }}>F</Avatar>, isSelf: false },
// ];

const ChatApp = () => {

  const messages = useMessages(1)

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
      </Sider>
      <Layout>
        <Content style={{ padding: '20px' }}>
          {/* Chat area */}
          <List
            dataSource={messages}
            renderItem={message => (
              <div style={{
                display: 'flex',
                justifyContent: message.isSelf ? 'flex-end' : 'flex-start',
                marginBottom: 10,
              }}>
                {!message.isSelf && <Avatar style={{ backgroundColor: '#f56a00' }}>F</Avatar>}
                <div style={{
                  maxWidth: '60%',
                  background: message.isSelf ? '#e6f7ff' : '#f6ffed',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  margin: message.isSelf ? '0 0 0 10px' : '0 10px 0 0',
                  textAlign: 'left',
                  display: 'inline-block', // Ensure the bubble size fits the content
                }}>
                  <p style={{ margin: 0 }}>{message.content}</p>
                </div>
                {message.isSelf && <Avatar style={{ backgroundColor: '#87d068' }}>S</Avatar>}
              </div>
            )}
          />
          {/* Message input */}
          <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '10px' }}>
            <Input
              addonAfter={
                <Button type="primary" icon={<SendOutlined />} />
              }
              placeholder="Type your message here..."
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatApp;
