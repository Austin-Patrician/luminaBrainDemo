import React, { useEffect, useState, useRef } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { useXAgent, useXChat, XStream } from '@ant-design/x';
import { createStyles } from 'antd-style';

import Header from '../components/chat/Header';
import Sidebar from '../components/chat/Sidebar';
import ChatContent from '../components/chat/ChatContent';
import ChatInput from '../components/chat/ChatInput';
import WelcomeView from '../components/chat/Welcome';

const { Sider, Content, Footer } = Layout;

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      background: ${token.colorBgContainer};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    `,
    content: css`
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      position: relative;
      padding-bottom: ${0}px; // 动态调整，取决于是否有固定footer
    `,
    messagesContainer: css`
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-thumb {
        background-color: ${token.colorBorder};
        border-radius: 3px;
      }
    `,
  };
});

const Chat: React.FC = () => {
  const { styles } = useStyle();
  const { token } = theme.useToken();
  
  // 状态
  const [conversationsItems, setConversationsItems] = useState([
    {
      key: "0",
      label: "What is Ant Design X?",
    },
  ]);
  const [activeKey, setActiveKey] = useState("0");
  const [hasMessages, setHasMessages] = useState(false);
  const abortRef = useRef(() => {});

  // 代理配置
  const [agent] = useXAgent({
    baseURL: "https://api.openai.com/v1/chat/completions",
    dangerouslyApiKey: "",
    model: "gpt-4o",
    request: async ({message}, { onSuccess, onUpdate, onError }) => {
      const userInputForm = {
        model: "gpt-4o",
        messages: [{ role: "user", content: message }],
        stream: true
      };

      try {
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`,
          },
          body: JSON.stringify(userInputForm),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const stream = XStream({
          readableStream: response.body ?? new ReadableStream(),
        });

        const reader = stream.getReader();
        abortRef.current = () => {
          reader?.cancel();
        };

        let current = '';
        while (reader) {
          const { value, done } = await reader.read();
          if (done) {
            onSuccess(current);
            break;
          }
          if (!value) continue;
          const data = JSON.parse(value.data);
          current += data.content || '';
          onUpdate(current);
        }
      } catch (error) {
        console.error('API request error:', error);
        onError(error instanceof Error ? error : new Error('Unknown error occurred'));
      }
    },
  });

  // 使用聊天钩子
  const { onRequest, messages, setMessages } = useXChat({
    agent,
    defaultMessages: [{
      id: 'welcome',  // 添加id属性
      status: 'local',
      message: "Hi, I'm LuminaBrain. How can I help you today?"
    }],
  });

  // 当活动会话改变时，重置消息
  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
      setHasMessages(false);
    }
  }, [activeKey]);

  // 当组件卸载时取消任何未完成的请求
  useEffect(() => {
    return () => {
      abortRef.current();
    };
  }, []);

  // 当消息列表更新时，检测是否有消息
  useEffect(() => {
    setHasMessages(messages.length > 1); // 大于1是因为有初始欢迎消息
  }, [messages]);

  // 添加新对话
  const onAddConversation = () => {
    const newKey = `${conversationsItems.length}`;
    setConversationsItems([
      ...conversationsItems,
      {
        key: newKey,
        label: `New Conversation ${conversationsItems.length}`,
      },
    ]);
    setActiveKey(newKey);
  };

  // 处理提交消息
  const handleSubmit = (content: string) => {
    if (!content.trim()) return;
    onRequest(content.trim());
  };

  // 添加清理函数
  const handleCleanup = () => {
    if (typeof abortRef.current === 'function') {
      abortRef.current();
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <Layout className={styles.layout}>
        <Header />
        <Layout>
          <Sider width={300} theme="light" style={{ borderRight: `1px solid ${token.colorBorder}` }}>
            <Sidebar
              conversationsItems={conversationsItems}
              activeKey={activeKey}
              onAddConversation={onAddConversation}
              onActiveChange={setActiveKey}
            />
          </Sider>
          <Layout>
            <Content className={styles.content} style={{ paddingBottom: hasMessages ? 80 : 0 }}>
              <div className={styles.messagesContainer}>
                <ChatContent
                  messages={messages}
                  placeholderNode={
                    <WelcomeView
                      onPromptClick={(text) => handleSubmit(text)}
                    />
                  }
                />
              </div>
              {!hasMessages && (
                <ChatInput
                  isFixed={false}
                  onSubmit={handleSubmit}
                  onCancel={handleCleanup}
                  isRequesting={agent.isRequesting()}
                />
              )}
            </Content>
            {hasMessages && (
              <ChatInput
                isFixed={true}
                onSubmit={handleSubmit}
                onCancel={handleCleanup}
                isRequesting={agent.isRequesting()}
              />
            )}
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Chat;
