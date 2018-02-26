import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/**
 * 懒加载
 */

// 主窗口
const Index = r => require.ensure([], () => r(require('@/views/index')), 'index');
const AddApp = r => require.ensure([], () => r(require('@/views/addapp')), 'addapp');
const Login = r => require.ensure([], () => r(require('@/views/login')), 'login');

// 新窗口
const AppDetail = r => require.ensure([], () => r(require('@/views/window/appDetail')), 'appdetail');
const Manage = r => require.ensure([], () => r(require('@/views/window/manage')), 'manage');
const Feedback = r => require.ensure([], () => r(require('@/views/window/feedback')), 'feedback');

// 组件
const ArticleList = r => require.ensure([], () => r(require('@/components/articleList')), 'articleList');
const Reader = r => require.ensure([], () => r(require('@/components/reader')), 'reader');
const Account = r => require.ensure([], () => r(require('@/components/account')), 'account');
const Setting = r => require.ensure([], () => r(require('@/components/setting')), 'setting');


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
      path: '/manage',
      component: Manage,
      children: [
        {
          path: 'login',
          component: Login
        },
        {
          path: 'account',
          component: Account
        },
        {
          path: 'setting',
          component: Setting
        }
      ]
    },
    {
      path: '/feedback',
      component: Feedback
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    },
  ],
});
