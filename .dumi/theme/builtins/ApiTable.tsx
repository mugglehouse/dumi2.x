import React, { useEffect, useState } from 'react';
import './ApiTable.less';

interface ApiTableProps {
  id: string;
}

interface ApiItem {
  name: string;
  type: string;
  description: string;
  default?: string;
  value?: string;
  params?: Array<{
    name: string;
    type: string;
    description: string;
    default?: string;
    required?: boolean;
  }>;
  returns?: {
    type: string;
    description: string;
  };
  properties?: Array<{
    name: string;
    type: string;
    description: string;
    default?: string;
    required?: boolean;
  }>;
  methods?: Array<{
    name: string;
    type: string;
    description: string;
    params?: Array<{
      name: string;
      type: string;
      description: string;
      default?: string;
      required?: boolean;
    }>;
    returns?: {
      type: string;
      description: string;
    };
  }>;
  members?: Array<{
    name: string;
    value?: string;
    description: string;
  }>;
}

const ApiTable: React.FC<ApiTableProps> = ({ id }) => {
  const [apiData, setApiData] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        const url = new URL('/api/ts-api', window.location.origin);
        url.searchParams.append('id', id);
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`获取API数据失败: ${response.statusText}`);
        }
        
        const data = await response.json();
        setApiData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    fetchApiData();
  }, [id]);

  if (loading) {
    return <div className="api-loading">加载中...</div>;
  }

  if (error) {
    return <div className="api-error">{error}</div>;
  }

  if (!apiData || apiData.length === 0) {
    return <div className="api-error">未找到API定义：{id}</div>;
  }

  return (
    <div className="api-table-container">
      {apiData.map((item) => (
        <div key={item.name} className="api-item">
          <h2 id={item.name} className="api-title">{item.name}</h2>
          {item.description && <p className="api-description">{item.description}</p>}

          {/* 类型定义 */}
          {item.type === 'type' && (
            <div className="api-type-definition">
              <h3 className="api-subtitle">类型定义</h3>
              <pre className="api-code-block"><code>{item.value}</code></pre>
              
              {/* 添加类型别名属性表格 */}
              {item.properties && item.properties.length > 0 && (
                <div className="api-properties">
                  <h3 className="api-subtitle">属性</h3>
                  <table className="api-table">
                    <thead>
                      <tr>
                        <th>名称</th>
                        <th>类型</th>
                        <th>描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.properties.map((prop) => (
                        <tr key={prop.name}>
                          <td className="api-prop-name">{prop.name}{prop.required ? '' : <span className="api-optional">?</span>}</td>
                          <td className="api-prop-type"><code>{prop.type}</code></td>
                          <td className="api-prop-desc">{prop.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 枚举定义 */}
          {item.type === 'enum' && (
            <div className="api-enum-definition">
              <h3 className="api-subtitle">枚举定义</h3>
              
              {item.members && item.members.length > 0 && (
                <div className="api-enum-members">
                  <table className="api-table">
                    <thead>
                      <tr>
                        <th>名称</th>
                        <th>值</th>
                        <th>描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.members.map((member) => (
                        <tr key={member.name}>
                          <td className="api-enum-name">{member.name}</td>
                          <td className="api-enum-value"><code>{member.value || '(auto)'}</code></td>
                          <td className="api-enum-desc">{member.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 属性表格 (接口和类) */}
          {(item.type === 'interface' || item.type === 'class') && item.properties && item.properties.length > 0 && (
            <div className="api-properties">
              <h3 className="api-subtitle">属性</h3>
              <table className="api-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>默认值</th>
                    <th>描述</th>
                  </tr>
                </thead>
                <tbody>
                  {item.properties.map((prop) => (
                    <tr key={prop.name}>
                      <td className="api-prop-name">{prop.name}{prop.required ? '' : <span className="api-optional">?</span>}</td>
                      <td className="api-prop-type"><code>{prop.type}</code></td>
                      <td className="api-prop-default">{prop.default || '-'}</td>
                      <td className="api-prop-desc">{prop.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 方法 (仅类) */}
          {item.type === 'class' && item.methods && item.methods.length > 0 && (
            <div className="api-methods">
              <h3 className="api-subtitle">方法</h3>
              {item.methods.map((method) => (
                <div key={method.name} className="api-method">
                  <h4 className="api-method-name">{method.name}</h4>
                  {method.description && <p className="api-method-desc">{method.description}</p>}

                  {/* 方法参数 */}
                  {method.params && method.params.length > 0 && (
                    <div className="api-method-params">
                      <h5 className="api-param-title">参数</h5>
                      <table className="api-table">
                        <thead>
                          <tr>
                            <th>名称</th>
                            <th>类型</th>
                            <th>默认值</th>
                            <th>描述</th>
                          </tr>
                        </thead>
                        <tbody>
                          {method.params.map((param) => (
                            <tr key={param.name}>
                              <td className="api-prop-name">{param.name}{param.required ? '' : <span className="api-optional">?</span>}</td>
                              <td className="api-prop-type"><code>{param.type}</code></td>
                              <td className="api-prop-default">{param.default || '-'}</td>
                              <td className="api-prop-desc">{param.description || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 返回值 */}
                  {method.returns && (
                    <div className="api-method-returns">
                      <h5 className="api-return-title">返回值</h5>
                      <p className="api-return-value"><code>{method.returns.type}</code>{method.returns.description ? ` - ${method.returns.description}` : ''}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 函数参数 */}
          {item.type === 'function' && item.params && item.params.length > 0 && (
            <div className="api-function-params">
              <h3 className="api-subtitle">参数</h3>
              <table className="api-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>类型</th>
                    <th>默认值</th>
                    <th>描述</th>
                  </tr>
                </thead>
                <tbody>
                  {item.params.map((param) => (
                    <tr key={param.name}>
                      <td className="api-prop-name">{param.name}{param.required ? '' : <span className="api-optional">?</span>}</td>
                      <td className="api-prop-type"><code>{param.type}</code></td>
                      <td className="api-prop-default">{param.default || '-'}</td>
                      <td className="api-prop-desc">{param.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 函数返回值 */}
          {item.type === 'function' && item.returns && (
            <div className="api-function-returns">
              <h3 className="api-subtitle">返回值</h3>
              <p className="api-return-value"><code>{item.returns.type}</code>{item.returns.description ? ` - ${item.returns.description}` : ''}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApiTable; 