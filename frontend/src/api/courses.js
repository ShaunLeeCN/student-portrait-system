import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 获取所有课程
export const getAllCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('获取所有课程失败:', error);
    throw error;
  }
};

// 根据ID获取课程
export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取课程详情失败:', error);
    throw error;
  }
};

// 根据学号获取课程
export const getCoursesByStudentNumber = async (studentNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/student/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('获取学生课程失败:', error);
    throw error;
  }
};

// 获取课程总数
export const getCourseCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/count`);
    return response.data;
  } catch (error) {
    console.error('获取课程总数失败:', error);
    throw error;
  }
};

// 获取平均成绩
export const getAverageScore = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/statistics/average`);
    return response.data;
  } catch (error) {
    console.error('获取平均成绩失败:', error);
    throw error;
  }
};

// 获取各类型课程平均成绩
export const getAverageScoreByType = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/statistics/average/courseType`);
    return response.data;
  } catch (error) {
    console.error('获取各类型课程平均成绩失败:', error);
    throw error;
  }
};

// 获取各学期平均成绩
export const getAverageScoreBySemester = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/statistics/average/semester`);
    return response.data;
  } catch (error) {
    console.error('获取各学期平均成绩失败:', error);
    throw error;
  }
};