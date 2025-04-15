import React from 'react';
import SearchBar from '../components/SearchBar';

const HomeLayout: React.FC = () => {
  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 112px)' }}>
      {/* 现有内容 */}
      <SearchBar />
    </div>
  );
};

export default HomeLayout;