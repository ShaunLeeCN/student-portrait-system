// src/pages/analysis/components/MajorRankingChart.js
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const MajorRankingChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>暂无数据</div>;
  }

  // 按平均分排序
  const sortedData = [...data].sort((a, b) => b.avg_score - a.avg_score);
  
  const majors = sortedData.map(item => item.major);
  const avgScores = sortedData.map(item => parseFloat(item.avg_score).toFixed(2));
  const studentCounts = sortedData.map(item => item.student_count);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const majorData = sortedData[params[0].dataIndex];
        return `<strong>${majorData.major}</strong><br/>
                平均分: ${parseFloat(majorData.avg_score).toFixed(2)}<br/>
                学生数: ${majorData.student_count}<br/>
                课程数: ${majorData.course_count}`;
      }
    },
    legend: {
      data: ['平均分', '学生人数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '分数',
      min: 0,
      max: 100,
      splitNumber: 10
    },
    yAxis: {
      type: 'category',
      data: majors,
      axisLabel: {
        formatter: function (value) {
          return value.length > 10 ? value.slice(0, 10) + '...' : value;
        }
      }
    },
    series: [
      {
        name: '平均分',
        type: 'bar',
        data: avgScores,
        itemStyle: {
          color: '#5470c6'
        },
        label: {
          show: true,
          position: 'right'
        }
      },
      {
        name: '学生人数',
        type: 'scatter',
        yAxisIndex: 0,
        symbolSize: function (value) {
          return Math.min(value * 0.7, 30); // 根据人数调整气泡大小
        },
        data: studentCounts.map((value, index) => {
          return [avgScores[index], majors[index]];
        }),
        itemStyle: {
          color: '#91cc75'
        }
      }
    ]
  };
  return (
    <div className="major-ranking-chart">
      <ReactEcharts 
        option={option} 
        style={{ height: '500px', width: '100%' }} 
        className="react-echarts-container"
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
  //return <ReactEcharts option={option} style={{ height: '500px' }} />;
};

export default MajorRankingChart;