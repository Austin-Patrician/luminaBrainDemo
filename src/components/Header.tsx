import React from 'react';
import { Layout, Space } from 'antd';
import { SettingOutlined, MinusOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons';

const { Header: AntdHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntdHeader style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }}>Grok</span>
      </div>
      <Space>
        <SettingOutlined style={{ fontSize: '16px' }} />
        <MinusOutlined style={{ fontSize: '16px' }} />
        <FullscreenOutlined style={{ fontSize: '16px' }} />
        <CloseOutlined style={{ fontSize: '16px' }} />
      </Space>
    </AntdHeader>
  );
};

export default Header;