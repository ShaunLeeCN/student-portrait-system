import api from './index';

// 获取所有课程
export const getAllCourses = () => {
  return api.get('/courses');
};

// 根据ID获取课程
export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

// 根据学号获取课程
export const getCoursesByStudentNumber = (studentNumber) => {
  return api.get(`/courses/student/${studentNumber}`);
};

// 获取平均成绩
export const getAverageScore = () => {
  return api.get('/courses/statistics/average');
};

// 获取各类型课程平均成绩
export const getAverageScoreByType = () => {
  return api.get('/courses/statistics/average/courseType');
};

// 获取各学期平均成绩
export const getAverageScoreBySemester = () => {
  return api.get('/courses/statistics/average/semester');
};