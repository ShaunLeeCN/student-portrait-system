import axios from 'axios';
// 请求拦截器
axios.interceptors.request.use(config => {
  console.log('发送请求:', config);
  return config;
}, error => {
  console.error('请求错误:', error);
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(response => {
  console.log('接收响应:', response);
  return response;
}, error => {
  console.error('响应错误:', error);
  return Promise.reject(error);
});

const API_URL = 'http://localhost:8080/api';

// 获取所有学生
export const getAllStudents = () => {
  return axios.get(`${API_URL}/students`).then(response => response.data);
};

// 根据ID获取学生
export const getStudentById = (id) => {
  return axios.get(`${API_URL}/students/${id}`).then(response => response.data);
};

// 根据学号获取学生
export const getStudentByNumber = (studentNumber) => {
  return axios.get(`${API_URL}/students/number/${studentNumber}`).then(response => response.data);
};

// 获取学生计数
export const countStudents = () => {
  return axios.get(`${API_URL}/students/count`).then(response => response.data);
};

// 根据专业统计学生
export const countStudentsByMajor = (major) => {
  return axios.get(`${API_URL}/students/count/major?major=${encodeURIComponent(major)}`).then(response => response.data);
};

// 添加学生
export const addStudent = (student) => {
  return axios.post(`${API_URL}/students`, student).then(response => response.data);
};

// 更新学生
export const updateStudent = (id, student) => {
  return axios.put(`${API_URL}/students/${id}`, student).then(response => response.data);
};

// 删除学生
export const deleteStudent = (id) => {
  return axios.delete(`${API_URL}/students/${id}`).then(response => response.data);
};