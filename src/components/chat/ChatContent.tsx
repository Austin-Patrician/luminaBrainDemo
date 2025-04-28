import React, { useRef } from 'react';
import { Bubble } from '@ant-design/x';
import { Typography } from 'antd';
import type { GetRef, GetProp } from 'antd';
import type { BubbleProps } from '@ant-design/x';
import { UserOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import WelcomeView from './Welcome.tsx';
import MarkdownRenderer from "../../components/MarkdownRenderer";

const useStyles = createStyles(({ token, css }) => ({
  chatContent: css`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    scroll-behavior: smooth;
  `,
  emptyContent: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
}));

// 定义消息类型接口
interface ChatMessage {
  id: string;
  message: string;
  status: 'loading' | 'success' | 'local';
}

interface ChatContentProps {
  messages: ChatMessage[];
  placeholderNode?: React.ReactNode;
  useRolesAsFunction?: boolean;
}

// 添加markdown渲染
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <MarkdownRenderer content={content} />
  </Typography>
);

const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  placeholderNode,
  useRolesAsFunction = false,
}) => {
  const { styles } = useStyles();
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);

  const rolesAsObject: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
      placement: 'start',
      avatar: { 
        icon: <UserOutlined />, 
        style: { background: 'linear-gradient(120deg, #1677ff, #1890ff)' } 
      },
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 650,
        background: '#f5f5f5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      },
      messageRender: renderMarkdown, // 添加markdown渲染
    },
    user: {
      placement: 'end',
      avatar: { 
        icon: <UserOutlined />, 
        style: { background: 'linear-gradient(120deg, #13c2c2, #06aaaa)' } 
      },
      style: {
        background: 'linear-gradient(120deg, #e6f7ff, #f0f5ff)',
        border: '1px solid #d9e8ff',
        maxWidth: 650,
      }
    },
  };

  const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
    switch (bubbleData.role) {
      case 'ai':
        return {
          ...rolesAsObject.ai,
        };
      case 'user':
        return {
          ...rolesAsObject.user,
        };
      default:
        return { };
    }
  };

  const items: GetProp<typeof Bubble.List, "items"> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === "loading",
      role: status === "success" ? "ai" : "user",
      content: message,
    })
  );

  // 当消息更新时滚动到底部
  React.useEffect(() => {
    if (messages.length > 0 && listRef.current) {
      setTimeout(() => {
        if (listRef.current?.scrollToBottom) {
          listRef.current.scrollToBottom();
        }
      }, 100);
    }
  }, [messages]);

  return (
    <div className={styles.chatContent}>
      {messages.length > 0 ? (
        <Bubble.List
          items={items}
          ref={listRef}
          roles={useRolesAsFunction ? rolesAsFunction : rolesAsObject}
        />
      ) : (
        <div className={styles.emptyContent}>
          {placeholderNode || <WelcomeView />}
        </div>
      )}
    </div>
  );
};

export default ChatContent;