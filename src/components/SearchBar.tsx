import React from 'react';
import { Input, Button, Space } from 'antd';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';

const SearchBar: React.FC = () => {
  return (
    <div style={{ position: 'absolute', bottom: '16px', left: '240px', right: '24px', display: 'flex', alignItems: 'center' }}>
      <Space>
        <AudioOutlined style={{ fontSize: '16px' }} />
        <span>DeepSearch</span>
        <Input placeholder="需要更多具体化？" style={{ width: '300px' }} />
        <Button type="primary" icon={<SearchOutlined />}>
          搜索
        </Button>
      </Space>
      <span style={{ marginLeft: 'auto' }}>Grok 3 ↑</span>
    </div>
  );
};

export default SearchBar;