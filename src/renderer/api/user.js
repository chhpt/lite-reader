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

export default {
  register,
  login,
  followAPP,
  cancelFollowAPP,
  getFollowAPPs
};
