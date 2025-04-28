import React, { useState } from 'react';
import { Button, Badge, Divider, Switch, Flex, Space } from 'antd';
import { 
  PaperClipOutlined, 
  SearchOutlined, 
  CloudUploadOutlined, 
  FireOutlined, 
  ReadOutlined 
} from '@ant-design/icons';
import { 
  Sender, 
  Prompts, 
  Attachments, 
  Suggestion 
} from '@ant-design/x';
import type { GetProp, GetRef } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  inputContainer: css`
    width: 100%;
    border-top: 1px solid ${token.colorBorder};
    background: ${token.colorBgContainer};
    padding: 16px;
    border-radius: 0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px;
  `,
  fixedFooter: css`
    position: fixed;
    bottom: 0;
    left: 280px;
    right: 0;
    background: ${token.colorBgContainer};
    padding: 16px;
    border-top: 1px solid ${token.colorBorder};
    z-index: 100;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
  `,
  prompt: css`
    margin-bottom: 16px;
  `,
}));

interface ChatInputProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isRequesting: boolean;
  isFixed: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  onCancel,
  isRequesting,
  isFixed = false,
}) => {
  const { styles } = useStyles();
  
  const [content, setContent] = useState('');
  const [headerOpen, setHeaderOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) => 
    setAttachedFiles(info.fileList);

  const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      description: 'Hot Topics',
      icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    },
    {
      key: '2',
      description: 'Design Guide',
      icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
  ];

  const suggestions: Exclude<GetProp<typeof Suggestion, 'items'>, () => void> = [
    { label: 'Write a report', value: 'report' },
    { label: 'Draw a picture', value: 'draw' },
    {
      label: 'Check some knowledge',
      value: 'knowledge',
      extra: 'Extra Info',
    },
  ];

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={async (file) => {
          // 自定义处理上传逻辑
          return false;
        }}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
              icon: <CloudUploadOutlined />,
              title: 'Upload files',
              description: 'Click or drag files to this area to upload',
            }
        }
      />
    </Sender.Header>
  );

  const handlePromptClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    if (info.data.description) {
      onSubmit(info.data.description as string);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');  // 清空输入框
  };

  return (
    <div className={isFixed ? styles.fixedFooter : styles.inputContainer}>
      {!isFixed && (
        <Prompts 
          className={styles.prompt}
          items={senderPromptsItems} 
          onItemClick={handlePromptClick} 
        />
      )}
      
      <Suggestion
        items={suggestions}
        onSelect={(itemVal) => {
          setContent(`[${itemVal}]:`);
        }}
        block
      >
        {({ onTrigger, onKeyDown }) => {
          return (
            <Sender
              loading={isRequesting}
              header={senderHeader}
              value={content}
              onChange={(nextVal) => {
                if (nextVal === '/') {
                  onTrigger();
                } else if (!nextVal) {
                  onTrigger(false);
                }
                setContent(nextVal);
              }}
              autoSize={{ minRows: 1, maxRows: 6 }}
              onKeyDown={onKeyDown}
              placeholder="输入 / 获取建议或直接提问..."
              footer={({ components }) => {
                const {
                  SendButton,
                  LoadingButton,
                  ClearButton,
                  SpeechButton,
                } = components;
                return (
                  <Flex justify="space-between" align="center">
                    <Flex gap="small" align="center">
                      <Badge dot={attachedFiles.length > 0 && !headerOpen}>
                        <Button
                          type="text"
                          icon={<PaperClipOutlined />}
                          onClick={() => setHeaderOpen(!headerOpen)}
                        />
                      </Badge>
                      <Divider type="vertical" />
                      <Space>
                        Deep Thinking
                        <Switch size="small" />
                      </Space>
                      {!isFixed && (
                        <>
                          <Divider type="vertical" />
                          <Button icon={<SearchOutlined />}>Search</Button>
                        </>
                      )}
                    </Flex>
                    <Flex align="center">
                      <ClearButton onClick={() => setContent('')} />
                      <Divider type="vertical" />
                      <SpeechButton />
                      <Divider type="vertical" />
                      {isRequesting ? (
                        <LoadingButton type="primary" />
                      ) : (
                        <SendButton type="primary" onClick={handleSubmit} disabled={!content.trim()} />
                      )}
                    </Flex>
                  </Flex>
                );
              }}
              onSubmit={handleSubmit}
              onCancel={onCancel}
              actions={false}
            />
          );
        }}
      </Suggestion>
    </div>
  );
};

export default ChatInput;