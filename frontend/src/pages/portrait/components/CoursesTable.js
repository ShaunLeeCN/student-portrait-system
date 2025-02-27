// src/pages/portrait/components/CoursesTable.js
import React from 'react';
import { Table, Tag, Card, Empty } from 'antd';

const CoursesTable = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <Card title="课程记录" className="detail-container">
        <Empty description="暂无课程记录" />
      </Card>
    );
  }
  
  // 定义表格列
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '课程代码',
      dataIndex: 'courseCode',
      key: 'courseCode',
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: '类型',
      dataIndex: 'courseType',
      key: 'courseType',
      render: (text) => (
        <Tag color={text === '必修' ? 'blue' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: '学分',
      dataIndex: 'credit',
      key: 'credit',
    },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      render: (score) => {
        let color = 'green';
        if (score < 60) {
          color = 'red';
        } else if (score < 70) {
          color = 'orange';
        } else if (score < 80) {
          color = 'blue';
        }
        return <Tag color={color}>{score}</Tag>;
      },
    },
  ];
  
  return (
    <Card title="课程记录" className="detail-container">
      <Table 
        columns={columns} 
        dataSource={courses.map((course, index) => ({ ...course, key: index }))} 
        pagination={{ pageSize: 10 }} 
      />
    </Card>
  );
};

export default CoursesTable;