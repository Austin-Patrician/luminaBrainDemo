import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
  Suggestion,
  AttachmentsProps
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
import { ApiOutlined, SearchOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Badge, Button, Divider, Switch, Typography, Flex, type GetProp, Space, theme } from 'antd';
import { IFileType, getFileExtByName, getFileTypeByName } from '../Utils/utils'
import { RcFile } from 'antd/es/upload'

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const defaultConversationsItems = [
  {
    key: '0',
    label: 'What is Ant Design X?',
  },
];


/**
 * Dify 支持的文件类型和对应的格式
 */
export const FileTypeMap: Map<IFileType, string[]> = new Map()



type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;
const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    extra: 'Extra Info',
  },
];

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
        width: 100%;
        min-width: 1000px;
        height: 722px;
        border-radius: ${token.borderRadius}px;
        display: flex;
        background: ${token.colorBgContainer};
        font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
  
        .ant-prompts {
          color: ${token.colorText};
        }
      `,
    menu: css`
        background: ${token.colorBgLayout}80;
        width: 280px;
        height: 100%;
        display: flex;
        flex-direction: column;
      `,
    conversations: css`
        width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
      `,
    chat: css`
        height: 100%;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: ${token.paddingLG}px;
        gap: 16px;
      `,
    messages: css`
        flex: 1;
      `,
    placeholder: css`
        padding-top: 32px;
      `,
    sender: css`
        box-shadow: ${token.boxShadow};
      `,
    logo: css`
        display: flex;
        height: 72px;
        align-items: center;
        justify-content: start;
        padding: 0 24px;
        box-sizing: border-box;
  
        img {
          width: 24px;
          height: 24px;
          display: inline-block;
        }
  
        span {
          display: inline-block;
          margin: 0 8px;
          font-weight: bold;
          color: ${token.colorText};
          font-size: 16px;
        }
      `,
    addBtn: css`
        background: #1677ff0f;
        border: 1px solid #1677ff34;
        width: calc(100% - 24px);
        margin: 0 12px 24px 12px;
      `,
  };
});

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

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <RobotOutlined />, style: { background: '#fde3cf' } },
    style: {
      // 减去一个头像的宽度
      maxWidth: 'calc(100% - 44px)',
    },
  },
  user: {
    placement: 'end',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#87d068',
      },
    }
    ,
    style: {
      // 减去一个头像的宽度
      maxWidth: 'calc(100% - 44px)',
      marginLeft: '44px',
    },
  },
}

const Independent: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();
  const { token } = theme.useToken();

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [content, setContent] = React.useState('');

  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);

  const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
    [],
  );

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      onSuccess(`Mock success return. You said: ${message}`);
    },
  });
  const iconStyle = {
    fontSize: 18,
    color: token.colorText,
  };
  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
    }
  }, [activeKey]);

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `New Conversation ${conversationsItems.length}`,
      },
    ]);
    setActiveKey(`${conversationsItems.length}`);
  };

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
    setActiveKey(key);
  };

  const groupable: GetProp<typeof Conversations, 'groupable'> = {
    sort(a, b) {
      if (a === b) return 0;

      return a === 'Today' ? -1 : 1;
    },
    title: (group, { components: { GroupTitle } }) =>
      group ? (
        <GroupTitle>
          <Space>
            <CommentOutlined />
            <span>{group}</span>
          </Space>
        </GroupTitle>
      ) : (
        <GroupTitle />
      ),
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const [files, setFiles] = React.useState<GetProp<AttachmentsProps, 'items'>>([])
  const [fileIdMap, setFileIdMap] = React.useState<Map<string, string>>(new Map())
  const handleUpload = async (file: RcFile) => {
    const prevFiles = [...files]

    const fileBaseInfo: GetProp<AttachmentsProps, 'items'>[number] = {
      uid: file.uid,
      name: file.name,
      status: 'uploading',
      size: file.size,
      type: file.type,
      originFileObj: file,
    }
    // 模拟上传进度
    const mockLoadingProgress = () => {
      let percent = 0
      setFiles([
        ...prevFiles,
        {
          ...fileBaseInfo,
          percent: percent,
        },
      ])
      const interval = setInterval(() => {
        if (percent >= 99) {
          clearInterval(interval)
          return
        }
        percent = percent + 1
        setFiles([
          ...prevFiles,
          {
            ...fileBaseInfo,
            percent,
          },
        ])
      }, 100)
      return {
        clear: () => clearInterval(interval),
      }
    }
    const { clear } = mockLoadingProgress()

    // const result = await uploadFileApi(file)
    // clear()
    // setFiles([
    // 	...prevFiles,
    // 	{
    // 		...fileBaseInfo,
    // 		percent: 100,
    // 		status: 'done',
    // 	},
    // ])
    // setFileIdMap(prevMap => {
    // 	const nextMap = new Map(prevMap)
    // 	nextMap.set(file.uid, result.id)
    // 	return nextMap
    // })
  }
  const handleSend = (text: string, files: any[]) => {
    console.log('Message:', text);
    console.log('Files:', files);
  };

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  );

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
        beforeUpload={
          async file => {
            // 校验文件类型
            // 自定义上传

            const ext = getFileExtByName(file.name)
            // 校验文件类型
            // if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(ext!)) {
            //   message.error(`不支持的文件类型: ${ext}`)
            //   return false
            // }

            handleUpload(file)
            return false
          }
        }
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

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Ant Design X</span>
    </div>
  );

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          New Conversation
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          groupable={groupable}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        {/* 🌟 输入框 */}
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
                header={senderHeader}
                prefix={
                  attachmentsNode
                }
                value={content}
                onChange={
                  (nextVal) => {
                    if (nextVal === '/') {
                      onTrigger();
                    } else if (!nextVal) {
                      onTrigger(false);
                    }
                    setContent(nextVal);
                  }}
                autoSize={{ minRows: 2, maxRows: 6 }}
                onKeyDown={onKeyDown}
                placeholder="输入 / 获取建议"
                footer={({ components }) => {
                  const { SendButton, LoadingButton, ClearButton, SpeechButton } = components;
                  return (
                    <Flex justify="space-between" align="center">
                      <Flex gap="small" align="center">
                        {/* <Button style={iconStyle} type="text" icon={<LinkOutlined />} /> */}
                        {/* <AttachmentSender style={iconStyle} onSubmit={handleSend}/> */}
                        <Divider type="vertical" />
                        Deep Thinking
                        <Switch size="small" />
                        <Divider type="vertical" />
                        <Button icon={<SearchOutlined />}>Global Search</Button>
                      </Flex>
                      <Flex align="center">
                        <ClearButton style={iconStyle} />
                        <Divider type="vertical" />
                        <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
                        <Divider type="vertical" />
                        <SpeechButton style={iconStyle} />
                        <Divider type="vertical" />
                        {loading ? (
                          <LoadingButton type="default" />
                        ) : (
                          <SendButton type="primary" disabled={false} />
                        )}
                      </Flex>
                    </Flex>
                  );
                }}
                onSubmit={onSubmit}
                onCancel={() => {
                  setLoading(false);
                }}
                actions={false}
              />
            );
          }}
        </Suggestion>
      </div>
    </div>
  );
};

export default Independent;