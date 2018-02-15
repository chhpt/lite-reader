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

export default {
  register
};
