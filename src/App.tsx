import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';

import Independent from './pages/Chat';

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ height: '100vh', width: '100vw', margin: 0 }}>
        <Layout.Content style={{ padding: 0, background: '#fff', height: '100%', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Independent />} />
            {/* 可添加更多路由 */}
          </Routes>
        </Layout.Content>
      </Layout>
    </Router>
  );
};

export default App;