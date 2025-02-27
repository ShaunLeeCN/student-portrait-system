// src/pages/dashboard/components/MajorRankingTable.js
import React from 'react';
import { Table } from 'antd';

const MajorRankingTable = ({ data }) => {
  // 表格列定义
  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '平均分',
      dataIndex: 'avg_score',
      key: 'avg_score',
      render: (text) => parseFloat(text).toFixed(1),
      sorter: (a, b) => a.avg_score - b.avg_score,
      defaultSortOrder: 'descend',
    },
    {
      title: '人数',
      dataIndex: 'student_count',
      key: 'student_count',
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="major"
      size="small"
      pagination={false}
    />
  );
};

export default MajorRankingTable;