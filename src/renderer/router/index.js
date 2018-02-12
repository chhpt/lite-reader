import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 懒加载
const Index = r => require.ensure([], () => r(require('@/views/index')), 'index');
const AddApp = r => require.ensure([], () => r(require('@/views/addapp')), 'addapp');
const AppDetail = r => require.ensure([], () => r(require('@/views/window/appDetail')), 'appdetail');

const ArticleList = r => require.ensure([], () => r(require('@/components/articleList')), 'articleList');
const Reader = r => require.ensure([], () => r(require('@/components/reader')), 'reader');

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
          path: 'addapp',
          name: 'addapp',
          component: AddApp
        }
      ]
    },
    {
      path: '/app_detail',
      component: AppDetail
    },
    {
      path: '/app_reader',
      component: Reader
    },
    {
      path: '*',
      redirect: '/'
    },
  ],
});
