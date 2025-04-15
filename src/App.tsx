import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';

import Independent from './pages/Chat';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Layout.Content style={{ padding: '24px', background: '#fff' }}>
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