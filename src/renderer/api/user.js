import service from '../utils/service';

const register = (email, username, password) => service({
  url: '/user/register',
  method: 'POST',
  data: {
    email,
    username,
    password
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

export default {
  register,
  login,
  logout,
  followAPP,
  cancelFollowAPP,
  getFollowAPPs,
  updateUserInfo,
};
