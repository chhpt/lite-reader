import API from '../../api';
import db from '../../../dataStore';

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
  followAPPs: []
};

const getters = {
  account: state => (state.account.id ? state.account : db.get('user.account').value())
};

const mutations = {
  setAccount(state, account) {
    state.account = account;
  },
  setFollowAPPs(state, followAPPs) {
    state.followAPPs = followAPPs || [];
  },
};

const actions = {
  async userRegister({ commit }, payload) {
    const { email, password, username } = payload;
    const res = await register(email, username, password);
    if (res.id) {
      commit('setAccount', { email, username });
    }
    return res;
  },
  async userLogin({ commit }, payload) {
    const { email, password } = payload;
    const res = await login(email, password);
    if (res.id) {
      const { username, id } = res;
      const account = { email, username, id };
      commit('setAccount', account);
      // 存储本地信息
      db.set('user.account', account).write();
    }
    return res;
  },
  async userLogout({ commit }) {
    const res = await logout();
    if (res.status) {
      commit('setAccount', {});
      commit('setFollowAPPs', []);
      // 清空本地信息
      db.set('user.account', null).write();
      db.set('user.follows', []).write();
    }
    return res;
  },
  async changeUserInfo({ commit }, payload) {
    const { username, email } = payload;
    const res = await updateUserInfo(username, email);
    if (res.status) {
      const { account } = res;
      commit('setAccount', account);
      // 存储本地信息
      db.set('user.account', account).write();
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
      db.set('user.follows', apps);
    }
    return res;
  },

  async cancelUserFollowAPP({ commit }, payload) {
    const { app } = payload;
    const res = await cancelFollowAPP(app);
    if (res.status) {
      const { apps } = res;
      commit('setFollowAPPs', apps);
      db.set('user.follows', apps);
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
