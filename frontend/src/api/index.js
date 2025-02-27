import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在请求发送前可以做一些处理，比如添加token
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据进行处理
    return response.data;
  },
  error => {
    // 对响应错误进行处理
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;