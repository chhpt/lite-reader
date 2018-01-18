import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 懒加载
const Index = r => require.ensure([], () => r(require('@/views/index')), 'index');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '*',
      redirect: '/'
    },
  ],
});
