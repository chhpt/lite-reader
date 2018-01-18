import { getAppList, getMenu } from '../../api';

const state = {
  appList: [],
  menu: []
};

const mutations = {
  setAppList(state, appList) {
    state.appList = appList;
  },
  setMenu(state, menu) {
    state.menu = menu;
  }
};

const actions = {
  async fetchAppList({ commit }) {
    const appList = await getAppList();
    commit('setAppList', appList);
    return appList;
  },
  async fetchMenu({ commit }, app) {
    const menu = await getMenu(app);
    commit('setMenu', menu);
    return menu;
  }
};

export default {
  state,
  mutations,
  actions,
};
