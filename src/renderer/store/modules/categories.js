import API from '../../api';

const { getCategories } = API;

const state = {
  categories: [],
  apps: []
};

const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
  },
  setApps(state, apps) {
    state.apps = apps;
  }
};

const actions = {
  async fetchCategories({ commit }) {
    const categories = await getCategories();
    commit('setCategories', categories);
    return categories;
  }
};

export default {
  state,
  mutations,
  actions,
};
