import React from 'react';
import { Button, Space, Typography } from 'antd';
import { PlusOutlined, CommentOutlined } from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { GetProp } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  sidebar: css`
    background: ${token.colorBgContainer};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid ${token.colorBorder};
    overflow: hidden;
    padding: 16px;
  `,
  addBtn: css`
    margin-bottom: 16px;
    background: ${token.colorPrimaryBg};
    border-color: ${token.colorPrimaryBorder};
    color: ${token.colorPrimaryText};
    width: 100%; /* 使用100%宽度但在sidebar中有padding */
    
    &:hover {
      background: ${token.colorPrimaryBgHover};
      border-color: ${token.colorPrimaryBorderHover};
    }
  `,
  conversations: css`
    flex: 1;
    overflow-y: auto;
    padding: 0 8px;

    .ant-conversations-item {
      padding: 12px 16px;
      margin: 4px 0;
      border-radius: ${token.borderRadiusLG}px;
      
      &:hover {
        background: ${token.colorBgTextHover};
      }
    }
    
    .ant-conversations-item-active {
      background: ${token.colorPrimaryBg};
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      
      &:hover {
        background: ${token.colorPrimaryBg};
      }
    }
  `,
}));

interface SidebarProps {
  conversationsItems: any[];
  activeKey: string;
  onAddConversation: () => void;
  onActiveChange: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversationsItems,
  activeKey,
  onAddConversation,
  onActiveChange
}) => {
  const { styles } = useStyles();

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
            <Typography.Text strong>{group}</Typography.Text>
          </Space>
        </GroupTitle>
      ) : (
        <GroupTitle />
      ),
  };

  return (
    <div className={styles.sidebar}>
      <Button
        onClick={onAddConversation}
        className={styles.addBtn}
        type="primary"
        icon={<PlusOutlined />}
      >
        新对话
      </Button>
      <Conversations
        items={conversationsItems}
        groupable={groupable}
        className={styles.conversations}
        activeKey={activeKey}
        onActiveChange={onActiveChange}
      />
    </div>
  );
};

export default Sidebar;