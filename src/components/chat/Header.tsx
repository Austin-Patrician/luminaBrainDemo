
import React from 'react';
import { Space, Typography } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  header: {
    display: 'flex',
    height: 64,
    alignItems: 'center',
    justifyContent: 'start',
    padding: '0 24px',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',

    '& img': {
      width: 32,
      height: 32,
      display: 'inline-block',
    },
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    marginLeft: 12,
    background: `linear-gradient(120deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}));

interface HeaderProps {
  title?: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'LuminaBrain', 
  logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original' 
}) => {
  const { styles } = useStyles();

  return (
    <div className={styles.header}>
      <Space className={styles.logo}>
        <img src={logo} draggable={false} alt="logo" />
        <Typography.Text className={styles.title}>{title}</Typography.Text>
      </Space>
    </div>
  );
};

export default Header;