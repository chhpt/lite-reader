import API from '../../api';

const { register, login } = API;

const state = {
  account: {
    email: '',
    id: ''
  }
};

const mutations = {
  setAccount(state, account) {
    state.account = account;
  }
};

const actions = {
  async userRegister({ commit }, payload) {
    const { email, password, username } = payload;
    const res = register(email, username, password);
    if (res.id) {
      commit('setAccount', { email, id: res.id });
    }
    return res;
  },
  async userLogin({ commit }, payload) {
    const { email, password } = payload;
    const res = login(email, password);
    if (res.id) {
      commit('setAccount', { email, id: res.id });
    }
    return res;
  }
};

export default {
  state,
  mutations,
  actions,
};
