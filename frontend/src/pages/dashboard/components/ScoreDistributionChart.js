// src/pages/dashboard/components/ScoreDistributionChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const ScoreDistributionChart = ({ data }) => {
  // 如果数据为空或未定义，显示空态
  if (!data || Object.keys(data).length === 0) {
    return <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>暂无数据</div>;
  }

  // 准备图表数据
  const categories = Object.keys(data);
  const values = Object.values(data);

  // 图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
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
            const colors = ['#91cc75', '#5470c6', '#fac858', '#ee6666', '#73c0de'];
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

  return <ReactEcharts option={option} style={{ height: '300px' }} />;
};

export default ScoreDistributionChart;