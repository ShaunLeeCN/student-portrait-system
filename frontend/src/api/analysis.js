import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// 获取成绩分布
export const getScoreDistribution = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/score-distribution`);
    return response.data;
  } catch (error) {
    console.error('获取成绩分布数据失败:', error);
    throw error;
  }
};

// 获取专业排名
export const getMajorRanking = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/major-ranking`);
    return response.data;
  } catch (error) {
    console.error('获取专业排名数据失败:', error);
    throw error;
  }
};

// 获取学生成绩趋势
export const getStudentScoreTrend = async (studentNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/score-trend/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('获取学生成绩趋势数据失败:', error);
    throw error;
  }
};

// 获取学生与平均水平差距
export const getStudentPerformanceGap = async (studentNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/performance-gap/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('获取学生表现差距数据失败:', error);
    throw error;
  }
};

// 预测学生成绩
export const predictStudentScore = async (studentNumber, courseType = '必修') => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/analysis/predict-score/${studentNumber}?courseType=${encodeURIComponent(courseType)}`
    );
    return response.data;
  } catch (error) {
    console.error('预测学生成绩失败:', error);
    throw error;
  }
};

// 获取学生能力雷达图数据
export const getStudentRadarChart = async (studentNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/radar-chart/${studentNumber}`);
    return response.data;
  } catch (error) {
    console.error('获取学生能力雷达图数据失败:', error);
    throw error;
  }
};