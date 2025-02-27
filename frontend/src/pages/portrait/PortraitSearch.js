// src/pages/portrait/PortraitSearch.js
import React, { useState } from 'react';
import { Input, Button, Card, Typography, Row, Col, Table, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

const PortraitSearch = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // 搜索学生
  const handleSearch = async (value) => {
    if (!value.trim()) {
      message.warning('请输入学号或姓名');
      return;
    }

    try {
      setLoading(true);
      
      // 调用搜索API
      const response = await axios.get(`/api/students/search?keyword=${encodeURIComponent(value)}`);
      
      setStudents(response.data || []);
      
      if (response.data.length === 0) {
        message.info('未找到相关学生');
      }
      
    } catch (error) {
      console.error('搜索学生失败:', error);
      message.error('搜索学生失败');
    } finally {
      setLoading(false);
    }
  };

  // 查看学生画像
  const handleViewPortrait = (studentNumber) => {
    navigate(`/portrait/${studentNumber}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '学号',
      dataIndex: 'studentNumber',
      key: 'studentNumber',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => handleViewPortrait(record.studentNumber)}
        >
          查看画像
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>学生画像查询</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Row justify="center">
          <Col xs={24} sm={16} md={12} lg={10} xl={8}>
            <Search
              placeholder="请输入学号或姓名搜索"
              enterButton={<><SearchOutlined /> 搜索</>}
              size="large"
              loading={loading}
              onSearch={handleSearch}
            />
          </Col>
        </Row>
      </Card>
      
      {students.length > 0 && (
        <Card title="搜索结果">
          <Table
            columns={columns}
            dataSource={students}
            rowKey="studentNumber"
            loading={loading}
          />
        </Card>
      )}
    </div>
  );
};

export default PortraitSearch;