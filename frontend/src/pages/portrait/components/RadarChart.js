// src/pages/portrait/components/RadarChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Empty } from 'antd';

const RadarChart = ({ radarData }) => {
  if (!radarData || !radarData.radarChartData || radarData.radarChartData.length === 0) {
    return (
      <Card title="能力雷达图" className="detail-container">
        <Empty description="暂无雷达图数据" />
      </Card>
    );
  }
  
  const radarChartData = radarData.radarChartData;
  const dimensions = radarChartData.map(item => item.dimension);
  const scores = radarChartData.map(item => item.score);
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: dimensions.map(dim => ({ name: dim, max: 100 })),
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(114, 172, 209, 0.1)', 'rgba(114, 172, 209, 0.2)', 
                 'rgba(114, 172, 209, 0.3)', 'rgba(114, 172, 209, 0.4)', 
                 'rgba(114, 172, 209, 0.5)']
        }
      },
      axisName: {
        color: '#333',
        fontSize: 14,
      }
    },
    series: [{
      name: '综合能力',
      type: 'radar',
      data: [
        {
          value: scores,
          name: '能力评分',
          areaStyle: {
            color: 'rgba(25, 118, 210, 0.5)'
          },
          lineStyle: {
            color: 'rgba(25, 118, 210, 0.8)',
            width: 2
          },
          itemStyle: {
            color: '#1976d2'
          }
        }
      ]
    }]
  };
  
  return (
    <Card title="综合能力雷达图" className="detail-container">
      <div className="radar-chart-container">
        <ReactEcharts 
          option={option} 
          style={{ height: '100%', width: '100%' }} 
        />
      </div>
      
      <div style={{ marginTop: 16 }}>
        {radarData.abilitySummary && (
          <>
            <p>最强能力维度：{radarData.abilitySummary.highestAbility}</p>
            <p>最弱能力维度：{radarData.abilitySummary.lowestAbility}</p>
            <p>平均能力分：{radarData.abilitySummary.averageScore?.toFixed(2)}</p>
          </>
        )}
      </div>
    </Card>
  );
};

export default RadarChart;