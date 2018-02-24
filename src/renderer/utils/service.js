import axios from 'axios';
import store from '../store';
// import router from '../router';

const baseURL = 'http://localhost:3000';

// 创建实例
const service = axios.create({
  baseURL,
  withCredentials: true,
  // timeout: 10000
});

// 添加一个请求拦截器
service.interceptors.request.use(config => config, error => Promise.reject(error));

// 添加一个返回拦截器
service.interceptors.response.use(response => response.data, (error) => {
  // 错误，重定向到错误页面
  if (error.response) {
    store.commit('setErrorInfo', error.response);
    if (error.response.status) {
      const { status } = error.response;
      if (status === 404) {
        new Notification('警告', {
          body: '请求错误'
        });
      }
      if (status === 500) {
        new Notification('警告', {
          body: '服务器异常'
        });
      }
    }
  } else if (error.message.indexOf('timeout') > -1) {
    // 请求超时
    store.commit('setLoading', false);
    return Promise.reject('请求超时，请重试');
  } else if (error.message === 'Network Error') {
    // 网络错误
    new Notification('警告', {
      body: '请求错误，请检查你的网络或重试！'
    });
    throw new Error(error.message);
  }
  return Promise.reject(error.response);
});

export default service;
