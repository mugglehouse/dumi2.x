import React, { useEffect, useState } from 'react';

interface AutoApiProps {
  src: string;
}

const AutoApi: React.FC<AutoApiProps> = ({ src }) => {
  const [content, setContent] = useState<string>('加载中...');

  useEffect(() => {
    if (!src) {
      setContent('错误: 缺少src属性');
      return;
    }

    console.log('请求API文档路径:', src);
    
    // 客户端渲染时通过API获取内容
    fetch(`/api/typedoc?path=${encodeURIComponent(src)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP错误 ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        setContent(text || '未找到API文档内容');
      })
      .catch(err => {
        setContent(`加载API文档出错: ${err.message}`);
        console.error('API请求错误:', err);
      });
  }, [src]);

  return <div className="typedoc-content" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default AutoApi;