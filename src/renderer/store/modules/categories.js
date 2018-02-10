import { getCategories } from '../../api';

const state = {
  categories: []
};

const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
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
