// src/pages/student/components/StudentForm.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { addStudent, updateStudent } from '../../../api/student';

const { Option } = Select;

const StudentForm = ({ visible, student, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const isEdit = !!student;

  // 当student属性变化时更新表单字段
  useEffect(() => {
    if (visible) {
      if (student) {
        form.setFieldsValue(student);
      } else {
        form.resetFields();
      }
    }
  }, [visible, student, form]);

  // 表单提交处理
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit) {
        await updateStudent(student.id, values);
        message.success('更新成功');
      } else {
        await addStudent(values);
        message.success('添加成功');
      }
      
      onOk();
    } catch (error) {
      console.error('表单提交失败:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑学生' : '添加学生'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
      >
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
          <Select placeholder="请选择性别">
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="age"
          label="年龄"
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="major"
          label="专业"
        >
          <Input placeholder="请输入专业" />
        </Form.Item>
        
        <Form.Item
          name="grade"
          label="年级"
        >
          <Input placeholder="请输入年级" />
        </Form.Item>
        
        <Form.Item
          name="college"
          label="学院"
        >
          <Input placeholder="请输入学院" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;