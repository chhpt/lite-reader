import service from '../utils/service';

const sendVerificationCode = (email) => service({
  url: '/user/send_verification_code',
  method: 'POST',
  data: {
    email
  }
});

const register = (email, username, password, code) => service({
  url: '/user/register',
  method: 'POST',
  data: {
    email,
    username,
    password,
    code
  }
});

const login = (email, password) => service({
  url: '/user/login',
  method: 'POST',
  data: {
    email,
    password
  }
});

const logout = () => service({
  url: '/user/logout',
  method: 'POST'
});

const getFollowAPPs = () => service({
  url: '/auth/get_follow_apps',
  method: 'GET'
});

const followAPP = (app) => service({
  url: '/auth/follow_app',
  method: 'POST',
  data: {
    app
  }
});

const cancelFollowAPP = (app) => service({
  url: '/auth/cancel_follow_app',
  method: 'POST',
  data: {
    app
  }
});

const updateUserInfo = (username, email) => service({
  url: '/auth/update_user_info',
  method: 'POST',
  data: {
    username,
    email
  }
});

const changePassword = (oldPassword, newPassword) => service({
  url: '/auth/change_password',
  method: 'POST',
  data: {
    oldPassword,
    newPassword
  }
});

const getCollectArticles = () => service({
  url: '/auth/get_collect_articles',
  method: 'GET'
});


const collectArticle = (article) => service({
  url: '/auth/collect_article',
  method: 'POST',
  data: {
    article
  }
});

const cancelCollectArticle = (url) => service({
  url: '/auth/cancel_collect_article',
  method: 'POST',
  data: {
    url
  }
});

export default {
  sendVerificationCode,
  register,
  login,
  logout,
  followAPP,
  cancelFollowAPP,
  getFollowAPPs,
  updateUserInfo,
  changePassword,
  getCollectArticles,
  collectArticle,
  cancelCollectArticle
};
