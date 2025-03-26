import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 获取基本学生画像
export const getStudentPortrait = async (studentNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portrait/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('获取学生画像失败:', error);
    throw error;
  }
};

// 获取增强版学生画像（包含更多分析数据）
export const getEnhancedStudentPortrait = async (studentNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portrait/enhanced/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('获取增强版学生画像失败:', error);
    throw error;
  }
};

// 触发学生画像计算
export const calculateStudentPortrait = async (studentNumber) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portrait/calculate/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('计算学生画像失败:', error);
    throw error;
  }
};