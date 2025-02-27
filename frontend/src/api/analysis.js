import api from './index';

// 获取成绩分布
export const getScoreDistribution = () => {
  return api.get('/analysis/score-distribution');
};

// 获取专业排名
export const getMajorRanking = () => {
  return api.get('/analysis/major-ranking');
};

// 获取学生成绩趋势
export const getStudentScoreTrend = (studentNumber) => {
  return api.get(`/analysis/score-trend/${studentNumber}`);
};

// 获取学生与平均水平差距
export const getStudentPerformanceGap = (studentNumber) => {
  return api.get(`/analysis/performance-gap/${studentNumber}`);
};

// 预测学生成绩
export const predictStudentScore = (studentNumber, courseType = '必修') => {
  return api.get(`/analysis/predict-score/${studentNumber}?courseType=${encodeURIComponent(courseType)}`);
};

// 获取学生能力雷达图数据
export const getStudentRadarChart = (studentNumber) => {
  return api.get(`/analysis/radar-chart/${studentNumber}`);
};