import API from '../../api';
import db from '../../../dataStore';
import colors from '../../themes/color';

const {
  register,
  login,
  logout,
  getFollowAPPs,
  updateUserInfo,
  followAPP,
  cancelFollowAPP
} = API;

const state = {
  account: {},
  followAPPs: [],
  themeColor: {
    label: '',
    value: ''
  },
  colors: []
};

const getters = {
  account: state => (state.account.id ? state.account : db.get('user.account').value()),
  followAPPs: state => (state.followAPPs.length ? state.followAPPs : db.get('user.follows').value()),
  colors: state => (state.colors.length ? state.colors : colors),
  themeColor: state => {
    if (state.themeColor.value) {
      return state.themeColor;
    }
    const theme = db.get('user.themeColor').value();
    return colors[theme];
  }
};

const mutations = {
  // 在 mutation 里对本地数据进行更改
  setAccount(state, account) {
    state.account = account;
    db.set('user.account', account).write();
  },
  setFollowAPPs(state, followAPPs) {
    state.followAPPs = followAPPs || [];
    db.set('user.follows', followAPPs).write();
  },
  setThemeColor(state, color) {
    state.themeColor = color;
    db.set('user.themeColor', color).write();
  }
};

const actions = {
  async userRegister({ commit }, payload) {
    const { email, password, username, code } = payload;
    const user = await register(email, username, password, code);
    if (user.id) {
      commit('setAccount', { email, username });
    }
    return user;
  },
  async userLogin({ commit }, payload) {
    const { email, password } = payload;
    const user = await login(email, password);
    if (user.id) {
      const { username, id } = user;
      const account = { email, username, id };
      commit('setAccount', account);
    }
    return user;
  },
  async userLogout({ commit }) {
    const res = await logout();
    if (res.status) {
      commit('setAccount', {});
      commit('setFollowAPPs', []);
    }
    return res;
  },
  async changeUserInfo({ commit }, payload) {
    const { username, email } = payload;
    const res = await updateUserInfo(username, email);
    if (res.status) {
      const { account } = res;
      commit('setAccount', account);
    }
    return res;
  },
  async fetchFollowAPPs({ commit }) {
    const res = await getFollowAPPs();
    const { apps } = res;
    if (res.status) {
      commit('setFollowAPPs', apps);
    }
    return res;
  },

  async userFollowAPP({ commit }, payload) {
    const { app } = payload;
    const res = await followAPP(app);
    if (res.status) {
      const { apps } = res;
      commit('setFollowAPPs', apps);
    }
    return res;
  },

  async cancelUserFollowAPP({ commit }, payload) {
    const { app } = payload;
    const res = await cancelFollowAPP(app);
    if (res.status) {
      const { apps } = res;
      commit('setFollowAPPs', apps);
    }
    return res;
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
