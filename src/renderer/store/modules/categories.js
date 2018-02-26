import API from '../../api';
import db from '../../../dataStore';

const { getCategories } = API;

const state = {
  categories: [],
  apps: []
};

const getters = {
  categories: state => (state.categories.length ? state.categories : db.get('app.categories').value())
};

const mutations = {
  setCategories(state, categories) {
    state.categories = categories || [];
    db.set('app.categories', categories).write();
  },
  setAPPs(state, apps) {
    state.apps = apps || [];
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
  getters,
  mutations,
  actions,
};
