import axios from 'axios';
import store from '../store';
import router from '../router';

const baseURL = 'http://localhost:3000';

// 创建实例
const service = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 5000
});

// 添加一个请求拦截器
service.interceptors.request.use(config => config, error => Promise.reject(error));

// 添加一个返回拦截器
service.interceptors.response.use(response => response.data, (error) => {
  // 错误，重定向到错误页面
  if (error.response) {
    store.commit('setErrorInfo', error.response);
    if (error.response.status) {
      router.push(`/error?status=${error.response.status}`);
    }
  } else if (error.message.indexOf('timeout') > -1) {
    // 请求超时
    return Promise.reject('请求超时，请重试');
  } else {
    // 其他在设置请求时触发的错误
    router.push('/error');
    throw new Error(error.message);
  }
  return Promise.reject(error.response);
});

export default service;
