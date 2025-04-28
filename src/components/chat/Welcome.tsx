import React from 'react';
import { Space, Typography, Button, Card } from 'antd';
import { Welcome, Prompts } from '@ant-design/x';
import type { GetProp } from 'antd';
import { FireOutlined, ReadOutlined, HeartOutlined, SmileOutlined, CommentOutlined, ShareAltOutlined, EllipsisOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  welcome: css`
    max-width: 800px;
    padding: 24px;
  `,
  card: css`
    margin-top: 24px;
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  `,
  promptsContainer: css`
    width: 100%;
    margin-top: 24px;
  `,
}));

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

interface WelcomeViewProps {
  onPromptClick?: (text: string) => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onPromptClick }) => {
  const { styles } = useStyles();

  const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
      description: 'What are you interested in?',
      children: [
        {
          key: '1-1',
          description: `What's new in X?`,
        },
        {
          key: '1-2',
          description: `What's AGI?`,
        },
        {
          key: '1-3',
          description: `Where is the doc?`,
        },
      ],
    },
    {
      key: '2',
      label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
      description: 'How to design a good product?',
      children: [
        {
          key: '2-1',
          icon: <HeartOutlined />,
          description: `Know the well`,
        },
        {
          key: '2-2',
          icon: <SmileOutlined />,
          description: `Set the AI role`,
        },
        {
          key: '2-3',
          icon: <CommentOutlined />,
          description: `Express the feeling`,
        },
      ],
    },
  ];

  const handlePromptClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    if (onPromptClick && info.data.description) {
      onPromptClick(info.data.description as string);
    }
  };

  return (
    <div className={styles.welcome}>
      <Welcome
        variant="bordered"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm LuminaBrain"
        description="I'm your AI assistant powered by advanced language models. I can help answer questions, generate text, summarize information, and more."
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />}>Share</Button>
            <Button icon={<EllipsisOutlined />}>More</Button>
          </Space>
        }
      />
      
      <div className={styles.promptsContainer}>
        <Prompts
          title="Try asking me about"
          items={placeholderPromptsItems}
          styles={{
            list: {
              width: '100%',
            },
            item: {
              flex: 1,
            },
          }}
          onItemClick={handlePromptClick}
        />
      </div>
    </div>
  );
};

export default WelcomeView;