// src/pages/portrait/components/ScoreTrendChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Empty, Typography, Tag } from 'antd';

const { Text } = Typography;

const ScoreTrendChart = ({ trendData }) => {
  if (!trendData || !trendData.semesterTrend) {
    return (
      <Card title="成绩趋势" className="detail-container">
        <Empty description="暂无成绩趋势数据" />
      </Card>
    );
  }
  
  const semesterTrend = trendData.semesterTrend;
  const semesters = Object.keys(semesterTrend);
  const scores = semesters.map(sem => semesterTrend[sem]);
  
  // 趋势图配置
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}分'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: semesters,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '平均分数',
      min: function(value) {
        return Math.floor(Math.max(0, value.min - 10));
      }
    },
    series: [
      {
        name: '平均分',
        type: 'line',
        data: scores,
        smooth: true,
        markPoint: {
          data: [
            { type: 'max', name: '最高值' },
            { type: 'min', name: '最低值' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        },
        lineStyle: {
          color: '#1890ff',
          width: 3
        },
        itemStyle: {
          color: '#1890ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: 'rgba(24,144,255,0.5)'
            }, {
                offset: 1, color: 'rgba(24,144,255,0.1)'
            }]
          }
        }
      }
    ]
  };
  
  // 根据趋势获取标签颜色
  const getTrendTagColor = (trend) => {
    if (trend.includes('上升')) return 'green';
    if (trend.includes('下降')) return 'red';
    return 'blue';
  };
  
  return (
    <Card title="成绩趋势" className="detail-container">
      <div style={{ height: 350 }}>
        <ReactEcharts 
          option={option} 
          style={{ height: '100%', width: '100%' }} 
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <p>
          <Text strong>总体趋势：</Text>
          <Tag color={getTrendTagColor(trendData.overallTrend)}>{trendData.overallTrend}</Tag>
        </p>
        
        {trendData.semesterChanges && Object.keys(trendData.semesterChanges).length > 0 && (
          <div>
            <Text strong>学期间变化：</Text>
            {Object.entries(trendData.semesterChanges).map(([semester, change], index) => (
              <p key={index}>
                {semester}: {change > 0 ? '+' : ''}{change.toFixed(2)}分
                <Tag 
                  color={change > 0 ? 'green' : change < 0 ? 'red' : 'blue'}
                  style={{ marginLeft: 8 }}
                >
                  {change > 0 ? '上升' : change < 0 ? '下降' : '持平'}
                </Tag>
              </p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScoreTrendChart;