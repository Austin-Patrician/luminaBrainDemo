import React from 'react';
import { Layout, Menu } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider width={200} style={{ background: '#f0f2f5' }}>
      <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key="1" icon={<BarChartOutlined />}>
          数据可视化
        </Menu.Item>
        {/* 可添加更多菜单项 */}
      </Menu>
    </Sider>
  );
};

export default Sidebar;