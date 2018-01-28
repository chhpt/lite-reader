import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 懒加载
const Index = r => require.ensure([], () => r(require('@/views/index')), 'index');
const ArticleList = r => require.ensure([], () => r(require('@/components/articleList')), 'articleList');
const Reader = r => require.ensure([], () => r(require('@/components/reader')), 'reader');
const Error = r => require.ensure([], () => r(require('@/components/error')), 'error');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'list',
          component: ArticleList
        },
        {
          path: 'reader',
          component: Reader
        },
        {
          path: 'error',
          name: 'error',
          component: Error
        },
      ]
    },
    {
      path: '*',
      redirect: '/'
    },
  ],
});
