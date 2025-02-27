// src/pages/student/StudentDetail.js
import React from 'react';
import { Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const StudentDetail = () => {
  const { id } = useParams();
  
  return (
    <Card>
      <Title level={2}>学生详情</Title>
      <p>学生ID: {id}</p>
      <p>此页面开发中...</p>
    </Card>
  );
};

export default StudentDetail;