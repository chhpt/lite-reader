import store from '../store';
import router from './index';
import db from '../../dataStore';
import bus from '../utils/bus';

// 记录浏览历史路由路径
router.beforeEach((to, from, next) => {
  const path = from.fullPath;
  store.commit('addHistory', path);
  next();
});

// 验证登录信息
router.beforeEach((to, from, next) => {
  if (to.path === '/manage/account') {
    const account = db.get('user.account').value();
    if (account.username) {
      next();
    } else {
      bus.$emit('manage-message', '你尚未登录，请先登录你的账号!');
      next('/manage/login');
    }
  } else {
    next();
  }
});
