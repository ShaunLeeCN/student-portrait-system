// src/pages/portrait/PortraitDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, Tabs, Typography, Row, Col, Divider, message } from 'antd';
import { ArrowLeftOutlined, BookOutlined, BarChartOutlined, IdcardOutlined } from '@ant-design/icons';
import { getEnhancedStudentPortrait, calculateStudentPortrait } from '../../api/portrait';
import BasicInfoCard from './components/BasicInfoCard';
import TagsList from './components/TagsList';
import CoursesTable from './components/CoursesTable';
import ScoreTrendChart from './components/ScoreTrendChart';
import RadarChart from './components/RadarChart';
import RecommendationList from './components/RecommendationList';

const { Title } = Typography;
const { TabPane } = Tabs;

const PortraitDetail = () => {
  const { studentNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // 获取学生画像数据
  useEffect(() => {
    const fetchPortrait = async () => {
      try {
        setLoading(true);
        const response = await getEnhancedStudentPortrait(studentNumber);
        setPortrait(response);
      } catch (error) {
        console.error('获取学生画像失败:', error);
        message.error('获取学生画像失败');
      } finally {
        setLoading(false);
      }
    };

    if (studentNumber) {
      fetchPortrait();
    }
  }, [studentNumber]);

  // 计算/更新学生画像
  const handleCalculatePortrait = async () => {
    try {
      setCalculating(true);
      await calculateStudentPortrait(studentNumber);
      message.success('学生画像计算已完成');
      
      // 重新加载画像数据
      const response = await getEnhancedStudentPortrait(studentNumber);
      setPortrait(response);
    } catch (error) {
      console.error('计算学生画像失败:', error);
      message.error('计算学生画像失败');
    } finally {
      setCalculating(false);
    }
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/portrait');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="portrait-detail-container">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
        >
          返回列表
        </Button>
        <Title level={2} style={{ margin: 0 }}>学生画像详情</Title>
        <Button 
          type="primary" 
          onClick={handleCalculatePortrait} 
          loading={calculating}
        >
          更新画像
        </Button>
      </div>

      {portrait && (
        <>
          {/* 基本信息部分 */}
          <BasicInfoCard student={portrait.basicInfo} statistics={portrait} />

          <Divider />

          {/* 标签、成绩、趋势分析等内容 */}
          <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
            <TabPane 
              tab={<span><IdcardOutlined />基础画像</span>}
              key="1"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="学习能力标签" className="detail-container">
                    <TagsList tags={portrait.academicTags} />
                  </Card>
                  <Card title="兴趣偏好标签" className="detail-container" style={{ marginTop: 16 }}>
                    <TagsList tags={portrait.interestTags} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="能力雷达图" className="detail-container">
                    <RadarChart data={portrait.radarChartData || []} />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="学习建议与推荐" className="detail-container">
                    <RecommendationList 
                      recommendations={portrait.learningRecommendations}
                      recommendedCourses={portrait.recommendedCourses}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane 
              tab={<span><BookOutlined />课程记录</span>} 
              key="2"
            >
              <CoursesTable courses={portrait.courseRecords || []} />
            </TabPane>

            <TabPane 
              tab={<span><BarChartOutlined />趋势分析</span>} 
              key="3"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Card title="学期成绩趋势" className="chart-container">
                    <ScoreTrendChart data={portrait.scoreTrendAnalysis || []} />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="学习表现对比" className="detail-container">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card title="与班级平均成绩对比" bordered={false}>
                          {portrait.performanceGap && (
                            <div>
                              <Typography.Paragraph>
                                个人平均分: <strong>{portrait.averageScore?.toFixed(1) || 'N/A'}</strong>
                              </Typography.Paragraph>
                              <Typography.Paragraph>
                                班级平均分: <strong>{portrait.performanceGap.classAverage?.toFixed(1) || 'N/A'}</strong>
                              </Typography.Paragraph>
                              <Typography.Paragraph>
                                差距: <strong style={{
                                  color: (portrait.performanceGap.classGap || 0) >= 0 ? '#3f8600' : '#cf1322'
                                }}>
                                  {(portrait.performanceGap.classGap || 0) >= 0 ? '+' : ''}
                                  {portrait.performanceGap.classGap?.toFixed(1) || 'N/A'}
                                </strong>
                              </Typography.Paragraph>
                            </div>
                          )}
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="与专业平均成绩对比" bordered={false}>
                          {portrait.performanceGap && (
                            <div>
                              <Typography.Paragraph>
                                个人平均分: <strong>{portrait.averageScore?.toFixed(1) || 'N/A'}</strong>
                              </Typography.Paragraph>
                              <Typography.Paragraph>
                                专业平均分: <strong>{portrait.performanceGap.majorAverage?.toFixed(1) || 'N/A'}</strong>
                              </Typography.Paragraph>
                              <Typography.Paragraph>
                                差距: <strong style={{
                                  color: (portrait.performanceGap.majorGap || 0) >= 0 ? '#3f8600' : '#cf1322'
                                }}>
                                  {(portrait.performanceGap.majorGap || 0) >= 0 ? '+' : ''}
                                  {portrait.performanceGap.majorGap?.toFixed(1) || 'N/A'}
                                </strong>
                              </Typography.Paragraph>
                            </div>
                          )}
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </>
      )}

      {!portrait && !loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Typography.Text type="secondary">未找到该学生的画像数据</Typography.Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PortraitDetail;