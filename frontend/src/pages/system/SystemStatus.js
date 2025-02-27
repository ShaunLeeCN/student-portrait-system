// src/pages/system/SystemStatus.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Badge, Spin, Descriptions, Tabs, Collapse } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const SystemStatus = () => {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({});
  const [dbStatus, setDbStatus] = useState({});
  const [tablesInfo, setTablesInfo] = useState([]);

  // 获取系统状态数据
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setLoading(true);
        
        // 获取系统健康状态
        const healthResponse = await axios.get('/api/system/health');
        setHealthData(healthResponse.data || {});
        
        // 获取数据库状态
        const dbResponse = await axios.get('/api/system/db-status');
        setDbStatus(dbResponse.data || {});
        
        // 获取表信息
        const tablesResponse = await axios.get('/api/system/tables');
        const tables = tablesResponse.data?.tables || [];
        const counts = tablesResponse.data?.recordCounts || {};
        
        const tablesList = tables.map(table => ({
          name: table,
          recordCount: counts[table] || 0
        }));
        
        setTablesInfo(tablesList);
        
      } catch (error) {
        console.error('获取系统状态数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemStatus();
  }, []);

  // 数据库表格列
  const tableColumns = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '记录数',
      dataIndex: 'recordCount',
      key: 'recordCount',
      sorter: (a, b) => a.recordCount - b.recordCount,
    }
  ];

  return (
    <div>
      <Title level={2}>系统状态</Title>
      
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="健康状态" key="1">
            <Card>
              <Descriptions title="系统状态" bordered>
                <Descriptions.Item label="状态">
                  <Badge 
                    status={healthData.status === 'UP' ? 'success' : 'error'} 
                    text={healthData.status === 'UP' ? '正常' : '异常'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="时间戳">
                  {healthData.timestamp ? new Date(healthData.timestamp).toLocaleString() : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </TabPane>
          
          <TabPane tab="数据库状态" key="2">
            <Card>
              <Descriptions title="数据库信息" bordered>
                <Descriptions.Item label="连接状态">
                  <Badge 
                    status={dbStatus.connection === '成功' ? 'success' : 'error'} 
                    text={dbStatus.connection || 'N/A'} 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="数据库">{dbStatus.database || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="URL">{dbStatus.url || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="用户名">{dbStatus.username || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="学生数量">{dbStatus.student_count || 0}</Descriptions.Item>
                <Descriptions.Item label="课程记录">{dbStatus.course_count || 0}</Descriptions.Item>
              </Descriptions>
              
              <Title level={4} style={{ marginTop: 20 }}>数据表</Title>
              <Table 
                columns={tableColumns}
                dataSource={tablesInfo}
                rowKey="name"
                pagination={false}
              />
            </Card>
          </TabPane>
          
          <TabPane tab="应用信息" key="3">
            <Collapse defaultActiveKey={['1']} style={{ marginBottom: 16 }}>
              <Panel header="环境信息" key="1">
                <Descriptions bordered>
                  <Descriptions.Item label="前端服务器">localhost:3000</Descriptions.Item>
                  <Descriptions.Item label="后端服务器">localhost:8080</Descriptions.Item>
                  <Descriptions.Item label="Node版本">
                    {process.env.NODE_VERSION || window.navigator.userAgent}
                  </Descriptions.Item>
                </Descriptions>
              </Panel>
              
              <Panel header="API访问路径" key="2">
                <ul>
                  <li><Text code>/api/students</Text> - 学生管理</li>
                  <li><Text code>/api/courses</Text> - 课程记录</li>
                  <li><Text code>/api/portrait</Text> - 学生画像</li>
                  <li><Text code>/api/analysis</Text> - 数据分析</li>
                  <li><Text code>/api/system</Text> - 系统管理</li>
                </ul>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default SystemStatus;