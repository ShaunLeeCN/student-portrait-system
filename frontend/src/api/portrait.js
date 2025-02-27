import api from './index';

// 获取学生画像
export const getStudentPortrait = (studentNumber) => {
  return api.get(`/portrait/${studentNumber}`);
};

// 获取增强版学生画像
export const getEnhancedStudentPortrait = (studentNumber) => {
  return api.get(`/portrait/enhanced/${studentNumber}`);
};

// 计算学生画像
export const calculateStudentPortrait = (studentNumber) => {
  return api.post(`/portrait/calculate/${studentNumber}`);
};