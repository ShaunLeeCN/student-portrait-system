// src/pages/analysis/components/ScoreCorrelationChart.js
import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Spin } from 'antd';

// 这里我们使用模拟数据，实际项目中可以替换为API调用
const ScoreCorrelationChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      // 模拟课程相关性数据
      const mockData = [
        ['数学', '物理', 0.85],
        ['数学', '编程', 0.75],
        ['物理', '编程', 0.65],
        ['英语', '文学', 0.73],
        ['英语', '历史', 0.58],
        ['历史', '文学', 0.82],
        ['体育', '健康', 0.91],
        ['音乐', '艺术', 0.88],
        ['物理', '健康', 0.12],
        ['编程', '音乐', 0.25],
        ['数学', '文学', 0.31],
        ['英语', '编程', 0.60],
      ];

      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const option = {
    title: {
      text: '课程成绩相关性热力图',
      left: 'center'
    },
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `${params.value[0]} 和 ${params.value[1]} 的相关性：${params.value[2]}`;
      }
    },
    grid: {
      height: '70%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: Array.from(new Set(data.map(item => item[0]))),
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: Array.from(new Set(data.map(item => item[1]))),
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      text: ['强相关', '弱相关'],
      color: ['#d94e5d', '#eac736', '#50a3ba']
    },
    series: [{
      type: 'heatmap',
      data: data.map(item => [item[0], item[1], item[2]]),
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return (
    <Spin spinning={loading}>
      {!loading && <ReactEcharts option={option} style={{ height: '500px' }} />}
    </Spin>
  );
};

export default ScoreCorrelationChart;