// src/pages/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
import { TeamOutlined, BookOutlined, TagsOutlined, RiseOutlined } from '@ant-design/icons';
import axios from 'axios';
import ScoreDistributionChart from './components/ScoreDistributionChart';
import MajorRankingTable from './components/MajorRankingTable';

const { Title } = Typography; 

// 定义API基础URL
const API_BASE_URL = 'http://localhost:8080/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    studentCount: 0,
    courseCount: 0,
    tagCount: 0,
    averageScore: 0
  });
  const [scoreDistribution, setScoreDistribution] = useState({});
  const [majorRanking, setMajorRanking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取学生总数
        const studentResponse = await axios.get(`${API_BASE_URL}/students/count`);
        const studentCount = studentResponse.data || 0;
        
        // 获取课程记录总数
        const courseResponse = await axios.get(`${API_BASE_URL}/courses/count`);
        const courseCount = courseResponse.data || 0;
        
        // 获取标签总数 - 如果这个API不存在，可能会失败
        let tagCount = 0;
        try {
          const tagResponse = await axios.get(`${API_BASE_URL}/tags/count`);
          tagCount = tagResponse.data || 0;
        } catch (err) {
          console.warn('获取标签总数失败:', err);
        }
        
        // 获取平均分
        const scoreResponse = await axios.get(`${API_BASE_URL}/courses/statistics/average`);
        const averageScore = scoreResponse.data || 0;
        
        setStatistics({
          studentCount,
          courseCount,
          tagCount,
          averageScore: parseFloat(averageScore).toFixed(1)
        });
        
        // 获取成绩分布
        try {
          const scoreDistResponse = await axios.get(`${API_BASE_URL}/analysis/score-distribution`);
          setScoreDistribution(scoreDistResponse.data || {});
        } catch (err) {
          console.warn('获取成绩分布失败:', err);
        }
        
        // 获取专业排名
        try {
          const majorRankResponse = await axios.get(`${API_BASE_URL}/analysis/major-ranking`);
          setMajorRanking(majorRankResponse.data || []);
        } catch (err) {
          console.warn('获取专业排名失败:', err);
        }
        
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Title level={2}>系统概览</Title>
      
      <Spin spinning={loading}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="学生总数" 
                value={statistics.studentCount} 
                prefix={<TeamOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="课程记录" 
                value={statistics.courseCount} 
                prefix={<BookOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="画像标签" 
                value={statistics.tagCount} 
                prefix={<TagsOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="平均分数" 
                value={statistics.averageScore} 
                precision={1}
                prefix={<RiseOutlined />} 
                suffix="分"
              />
            </Card>
          </Col>
        </Row>

        {/* 图表内容 */}
        <Row gutter={16}>
          <Col span={16}>
            <Card title="成绩分布" style={{ marginBottom: '24px' }}>
              <ScoreDistributionChart data={scoreDistribution.scoreDistribution} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="专业排名" style={{ marginBottom: '24px' }}>
              <MajorRankingTable data={majorRanking} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;