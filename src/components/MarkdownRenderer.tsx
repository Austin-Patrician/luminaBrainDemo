import React from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string; // Markdown 内容
  className?: string; // 自定义 CSS 类
  style?: React.CSSProperties; // 自定义样式
}

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动将 URL 转换为链接
  typographer: true, // 启用排版优化
});

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, style }) => {
  // 解析 Markdown 为 HTML
  const markdownHtml = md.render(content);

  // 清理 HTML，防止 XSS
  const sanitizedHtml = DOMPurify.sanitize(markdownHtml);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default MarkdownRenderer;