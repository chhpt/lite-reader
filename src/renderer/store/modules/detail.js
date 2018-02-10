import { getAppArticleList } from '../../api';

const state = {
  appArticleList: []
};

const mutations = {
  setAppArticleList(state, articleList) {
    state.appArticleList = articleList;
  }
};

const actions = {
  async fetchAppArticleList({ commit, state }, payload) {
    let articleList = await getAppArticleList(payload.section, payload.id);
    if (payload.id) {
      articleList = state.appArticleList.concat(articleList);
    }
    commit('setAppArticleList', articleList);
    return articleList;
  }
};

export default {
  state,
  mutations,
  actions,
};
