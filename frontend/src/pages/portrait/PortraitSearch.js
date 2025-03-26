// src/pages/portrait/PortraitSearch.js
import React, { useState } from 'react';
import { Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const PortraitSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 处理学生画像搜索
  const handleSearch = (studentNumber) => {
    if (!studentNumber || studentNumber.trim() === '') {
      message.warning('请输入有效的学号');
      return;
    }

    setLoading(true);
    
    // 直接导航到学生画像详情页
    navigate(`/portrait/${studentNumber.trim()}`);
    setLoading(false);
  };

  return (
    <div className="portrait-search-container">
      <Title level={2}>学生画像查询</Title>
      
      <Card className="search-card">
        <Row justify="center" gutter={[0, 24]}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Paragraph>
              输入学生学号，查看该学生的学习画像分析、特征标签及个性化建议。
            </Paragraph>
            
            <Search
              placeholder="请输入学生学号"
              enterButton={<Button type="primary" icon={<SearchOutlined />}>查询</Button>}
              size="large"
              prefix={<UserOutlined />}
              loading={loading}
              onSearch={handleSearch}
            />
          </Col>
        </Row>
      </Card>
      
      <Row justify="center" style={{ marginTop: 48 }}>
        <Col xs={24} sm={20} md={16}>
          <Card title="学生画像系统说明">
            <Paragraph>
              学生画像系统基于学生的学习数据，包括课程成绩、学习行为等多维度信息，
              构建全面的学生个人画像。系统可以帮助教师了解学生的学习特点，为个性化
              教学提供数据支持。
            </Paragraph>
            <Paragraph>
              <strong>主要功能：</strong>
              <ul>
                <li>学生基本信息展示</li>
                <li>学习成绩统计与趋势分析</li>
                <li>个性化学习特征标签</li>
                <li>能力多维度评估</li>
                <li>学习建议与课程推荐</li>
              </ul>
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PortraitSearch;