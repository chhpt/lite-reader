import API from '../../api';

const { getArticleList } = API;

const state = {
  // 应用的文章列表
  appArticleList: []
};

const mutations = {
  setAppArticleList(state, articleList) {
    state.appArticleList = articleList || [];
  }
};

const actions = {
  async fetchAppArticleList({ commit, state }, payload) {
    let articleList = await getArticleList(
      payload.type, payload.appId, payload.section, payload.id
    );
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
