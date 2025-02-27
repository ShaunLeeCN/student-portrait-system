// src/pages/student/StudentList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Card, Modal, Form, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllStudents, addStudent, updateStudent, deleteStudent } from '../../api/student';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  // 获取学生列表
  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('正在请求学生列表...');
      const data = await getAllStudents();
      console.log('获取到学生列表数据:', data);
      const studentArray = Array.isArray(data) ? data : [];
      setStudents(studentArray);
      setFilteredStudents(studentArray); // 初始化filteredStudents
    } catch (error) {
      console.error('获取学生列表失败:', error);
      console.error('错误详情:', error.response || error.message);
      message.error(`获取学生列表失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始化加载
  useEffect(() => {
    fetchStudents();
  }, []);

  // 处理搜索 - 修改这个函数
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      student => 
        (student.name && student.name.toLowerCase().includes(value.toLowerCase())) ||
        (student.studentNumber && student.studentNumber.includes(value)) ||
        (student.major && student.major.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredStudents(filtered);
  };

  // 每当searchText或students变化时，更新filteredStudents
  useEffect(() => {
    handleSearch(searchText);
  }, [searchText, students]);

  // 处理添加/编辑表单提交
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingStudent) {
        // 更新学生
        await updateStudent(editingStudent.id, values);
        message.success('更新学生信息成功');
      } else {
        // 添加学生
        await addStudent(values);
        message.success('添加学生成功');
      }
      
      setModalVisible(false);
      fetchStudents(); // 刷新列表
    } catch (error) {
      console.error('提交表单失败:', error);
    }
  };

  // 处理删除学生
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      message.success('删除学生成功');
      fetchStudents(); // 刷新列表
    } catch (error) {
      console.error('删除学生失败:', error);
      message.error('删除学生失败');
    }
  };

  // 打开添加模态框
  const showAddModal = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑模态框
  const showEditModal = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setModalVisible(true);
  };

  // 表格列配置
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
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="primary" 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title="学生管理">
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input 
              placeholder="搜索学生..." 
              prefix={<SearchOutlined />} 
              allowClear
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              添加学生
            </Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredStudents} // 使用filteredStudents代替直接过滤
          rowKey={record => record.id || record.studentNumber}
          loading={loading} 
        />

        <Modal
          title={editingStudent ? "编辑学生" : "添加学生"}
          open={modalVisible}
          onOk={handleFormSubmit}
          onCancel={() => setModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="studentNumber"
              label="学号"
              rules={[{ required: true, message: '请输入学号' }]}
            >
              <Input placeholder="请输入学号" />
            </Form.Item>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="性别"
            >
              <Input placeholder="请输入性别" />
            </Form.Item>
            <Form.Item
              name="age"
              label="年龄"
            >
              <Input type="number" placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item
              name="major"
              label="专业"
            >
              <Input placeholder="请输入专业" />
            </Form.Item>
            <Form.Item
              name="college"
              label="学院"
            >
              <Input placeholder="请输入学院" />
            </Form.Item>
            <Form.Item
              name="grade"
              label="年级"
            >
              <Input placeholder="请输入年级" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default StudentList;