// src/pages/analysis/components/ScoreDistributionChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const ScoreDistributionChart = ({ data }) => {
  if (!data || !data.scoreDistribution) {
    return <div>暂无数据</div>;
  }

  const distribution = data.scoreDistribution || {};
  const categories = Object.keys(distribution);
  const values = Object.values(distribution);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['学生人数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [
      {
        name: '学生人数',
        type: 'bar',
        data: values,
        itemStyle: {
          color: function(params) {
            const colors = ['#ee6666', '#fac858', '#91cc75', '#5470c6', '#73c0de'];
            return colors[params.dataIndex % colors.length];
          }
        },
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={option} style={{ height: '400px' }} />
      {data.averageScore && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          平均分：<strong>{data.averageScore.toFixed(2)}</strong>，
          最高分：<strong>{data.maxScore}</strong>，
          最低分：<strong>{data.minScore}</strong>，
          中位数：<strong>{data.medianScore?.toFixed(2)}</strong>
        </div>
      )}
    </div>
  );
};

export default ScoreDistributionChart;