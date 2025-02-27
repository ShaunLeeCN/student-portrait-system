// src/pages/portrait/components/BasicInfoCard.js
import React from 'react';
import { Card, Descriptions, Row, Col, Statistic } from 'antd';

const BasicInfoCard = ({ student, statistics }) => {
  return (
    <Card className="detail-container">
      <Row gutter={16}>
        <Col span={16}>
          <Descriptions title="基本信息" bordered>
            <Descriptions.Item label="姓名">{student?.name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="学号">{student?.studentNumber || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="性别">{student?.gender || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="年龄">{student?.age || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="专业" span={2}>{student?.major || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="学院" span={3}>{student?.college || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="年级">{student?.grade || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="班级">{student?.className || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="入学时间">{student?.enrollmentDate || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <Card title="学习概览" bordered={false}>
            <Row gutter={16}>
              <Col span={24}>
                <Statistic 
                  title="平均成绩" 
                  value={statistics?.averageScore?.toFixed(1) || 0} 
                  suffix="分" 
                  precision={1} 
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Statistic title="总学分" value={statistics?.totalCredits || 0} />
              </Col>
              <Col span={12}>
                <Statistic title="课程数" value={statistics?.courseCount || 0} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BasicInfoCard;