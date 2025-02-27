// // src/pages/portrait/PortraitDetail.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Button, Descriptions, Spin, Tabs, Typography, Row, Col, Tag, Divider, Statistic, message } from 'antd';
// import { ArrowLeftOutlined, BookOutlined, BarChartOutlined, IdcardOutlined } from '@ant-design/icons';
// import { getEnhancedStudentPortrait, calculateStudentPortrait } from '../../api/portrait';
// import BasicInfoCard from './components/BasicInfoCard';
// import AcademicTagsCard from './components/AcademicTagsCard';
// import CourseRecordsTable from './components/CourseRecordsTable';
// import ScoreTrendChart from './components/ScoreTrendChart';
// import RadarChart from './components/RadarChart';
// import RecommendationCard from './components/RecommendationCard';

// const { Title } = Typography;
// const { TabPane } = Tabs;

// const PortraitDetail = () => {
//   const { studentNumber } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [portrait, setPortrait] = useState(null);
//   const [calculating, setCalculating] = useState(false);

//   // 获取学生画像数据
//   useEffect(() => {
//     const fetchPortrait = async () => {
//       try {
//         setLoading(true);
//         const response = await getEnhancedStudentPortrait(studentNumber);
//         setPortrait(response);
//       } catch (error) {
//         console.error('获取学生画像失败:', error);
//         message.error('获取学生画像失败');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (studentNumber) {
//       fetchPortrait();
//     }
//   }, [studentNumber]);

//   // 计算/更新学生画像
//   const handleCalculatePortrait = async () => {
//     try {
//       setCalculating(true);
//       await calculateStudentPortrait(studentNumber);
//       message.success('学生画像计算已完成');
      
//       // 重新加载画像数据
//       const response = await getEnhancedStudentPortrait(studentNumber);
//       setPortrait(response);
//     } catch (error) {
//       console.error('计算学生画像失败:', error);
//       message.error('计算学生画像失败');
//     } finally {
//       setCalculating(false);
//     }
//   };

//   // 返回列表页
//   const handleBack = () => {
//     navigate('/portrait');
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <Spin size="large" tip="加载中..." />
//       </div>
//     );
//   }

//   return (
//     <div className="portrait-detail-container">
//       <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Button 
//           type="default" 
//           icon={<ArrowLeftOutlined />} 
//           onClick={handleBack}
//         >
//           返回列表
//         </Button>
//         <Title level={2} style={{ margin: 0 }}>学生画像详情</Title>
//         <Button 
//           type="primary" 
//           onClick={handleCalculatePortrait} 
//           loading={calculating}
//         >
//           更新画像
//         </Button>
//       </div>

//       {portrait && (
//         <>
//           {/* 基本信息部分 */}
//           <BasicInfoCard student={portrait.basicInfo} statistics={portrait} />

//           <Divider />

//           {/* 标签、成绩、趋势分析等内容 */}
//           <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
//             <TabPane 
//               tab={<span><IdcardOutlined />基础画像</span>}
//               key="1"
//             >
//               <Row gutter={16}>
//                 <Col span={12}>
//                   <AcademicTagsCard 
//                     academicTags={portrait.academicTags} 
//                     interestTags={portrait.interestTags} 
//                   />
//                 </Col>
//                 <Col span={12}>
//                   <RadarChart data={portrait.radarChartData} />
//                 </Col>
//               </Row>

//               <Row gutter={16} style={{ marginTop: 16 }}>
//                 <Col span={24}>
//                   <RecommendationCard 
//                     recommendedCourses={portrait.recommendedCourses}
//                     learningRecommendations={portrait.learningRecommendations}
//                   />
//                 </Col>
//               </Row>
//             </TabPane>

//             <TabPane 
//               tab={<span><BookOutlined />课程记录</span>} 
//               key="2"
//             >
//               <CourseRecordsTable courseRecords={portrait.courseRecords} />
//             </TabPane>

//             <TabPane 
//               tab={<span><BarChartOutlined />趋势分析</span>} 
//               key="3"
//             >
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <Card title="学期成绩趋势" className="chart-container">
//                     <ScoreTrendChart data={portrait.scoreTrendAnalysis} />
//                   </Card>
//                 </Col>
//               </Row>

//               <Row gutter={16} style={{ marginTop: 16 }}>
//                 <Col span={12}>
//                   <Card title="成绩预测" className="detail-container">
//                     <Statistic
//                       title="下学期预测成绩"
//                       value={portrait.scorePrediction?.predictedScore?.toFixed(1) || "N/A"}
//                       suffix="分"
//                       precision={1}
//                     />
//                     <p>预测范围: {portrait.scorePrediction?.predictionRange?.min?.toFixed(1)} - {portrait.scorePrediction?.predictionRange?.max?.toFixed(1)} 分</p>
//                     <p>置信度: {portrait.scorePrediction?.confidenceLevel || "未知"}</p>
//                   </Card>
//                 </Col>
//                 <Col span={12}>
//                   <Card title="与平均水平差距" className="detail-container">
//                     <Statistic
//                       title="与专业平均分差距"
//                       value={portrait.performanceGap?.majorGap?.toFixed(1) || "N/A"}
//                       valueStyle={{ 
//                         color: (portrait.performanceGap?.majorGap || 0) >= 0 ? '#3f8600' : '#cf1322' 
//                       }}
//                       suffix="分"
//                       precision={1}
//                       prefix={(portrait.performanceGap?.majorGap || 0) >= 0 ? '+' : ''}
//                     />
//                     <p>个人平均分: {portrait.performanceGap?.studentAverage?.toFixed(1)} 分</p>
//                     <p>专业平均分: {portrait.performanceGap?.majorAverage?.toFixed(1)} 分</p>
//                   </Card>
//                 </Col>
//               </Row>
//             </TabPane>
//           </Tabs>
//         </>
//       )}

//       {!portrait && !loading && (
//         <Card>
//           <div style={{ textAlign: 'center', padding: '20px 0' }}>
//             <Typography.Text type="secondary">未找到该学生的画像数据</Typography.Text>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default PortraitDetail;

import React from 'react';
import { Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const PortraitDetail = () => {
  const { studentNumber } = useParams();
  
  return (
    <Card>
      <Title level={2}>学生画像详情</Title>
      <p>学号: {studentNumber}</p>
      <p>此页面开发中...</p>
    </Card>
  );
};

export default PortraitDetail;