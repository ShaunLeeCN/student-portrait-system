// // src/pages/analysis/DataAnalysis.js
// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col, Spin, Select, Typography, Tabs } from 'antd';
// import { getScoreDistribution, getMajorRanking } from '../../api/analysis';
// import ScoreDistributionChart from './components/ScoreDistributionChart';
// import MajorRankingChart from './components/MajorRankingChart';
// import ScoreCorrelationChart from './components/ScoreCorrelationChart';
// import TrendAnalysisChart from './components/TrendAnalysisChart';

// const { Title } = Typography;
// const { TabPane } = Tabs;

// const DataAnalysis = () => {
//   const [loading, setLoading] = useState(true);
//   const [scoreDistribution, setScoreDistribution] = useState({});
//   const [majorRanking, setMajorRanking] = useState([]);
  
//   // 加载数据
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // 并发请求多个数据
//         const [scoreDistResponse, majorRankResponse] = await Promise.all([
//           getScoreDistribution(),
//           getMajorRanking()
//         ]);
        
//         setScoreDistribution(scoreDistResponse || {});
//         setMajorRanking(majorRankResponse || []);
//       } catch (error) {
//         console.error('获取数据分析数据失败:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);
  
//   return (
//     <div className="analysis-container">
//       <Title level={2}>数据分析</Title>
      
//       <Spin spinning={loading}>
//         <Tabs defaultActiveKey="1">
//           <TabPane tab="成绩分布" key="1">
//             <Row gutter={24}>
//               <Col span={24}>
//                 <Card title="学生成绩分布" className="chart-container">
//                   <ScoreDistributionChart data={scoreDistribution} />
//                 </Card>
//               </Col>
//             </Row>
            
//             <Row gutter={24} style={{ marginTop: '24px' }}>
//               <Col span={24}>
//                 <Card title="专业平均分排名" className="chart-container">
//                   <MajorRankingChart data={majorRanking} />
//                 </Card>
//               </Col>
//             </Row>
//           </TabPane>
          
//           <TabPane tab="相关性分析" key="2">
//             <Row gutter={24}>
//               <Col span={24}>
//                 <Card title="课程相关性分析" className="chart-container">
//                   <ScoreCorrelationChart />
//                 </Card>
//               </Col>
//             </Row>
//           </TabPane>
          
//           <TabPane tab="趋势分析" key="3">
//             <Row gutter={24}>
//               <Col span={24}>
//                 <Card title="学期成绩趋势" className="chart-container">
//                   <TrendAnalysisChart />
//                 </Card>
//               </Col>
//             </Row>
//           </TabPane>
//         </Tabs>
//       </Spin>
//     </div>
//   );
// };

// export default DataAnalysis;

import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const DataAnalysis = () => {
  return (
    <Card>
      <Title level={2}>数据分析</Title>
      <p>此页面开发中...</p>
    </Card>
  );
};

export default DataAnalysis;