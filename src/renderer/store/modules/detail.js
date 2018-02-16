import API from '../../api';

const { getAppArticleList } = API;

const state = {
  // 查看的应用
  app: {},
  // 应用的文章列表
  appArticleList: []
};

const mutations = {
  setApp(state, app) {
    state.app = app;
  },
  setAppArticleList(state, articleList) {
    state.appArticleList = articleList || [];
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
