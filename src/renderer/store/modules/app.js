import { getAppList, getMenu, getArticleList, getArticle } from '../../api';

const state = {
  activeItem: '',
  name: '',
  appList: [],
  articleList: [],
  menu: [],
  article: {},
  loading: false
};

const mutations = {
  setAppList(state, appList) {
    state.appList = appList;
  },
  setMenu(state, menu) {
    state.menu = menu;
  },
  setAppName(state, name) {
    state.name = name;
  },
  setArticleList(state, articleList) {
    state.articleList = articleList;
  },
  setArticle(state, article) {
    state.article = article;
  },
  setActiveItem(state, item) {
    state.activeItem = item;
  },
  setLoading(state, loading) {
    state.loading = loading;
  }
};

const actions = {
  async fetchAppList({ commit }) {
    const appList = await getAppList();
    commit('setAppList', appList);
    return appList;
  },

  async fetchMenu({ commit }, app) {
    commit('setMenu', []);
    const menu = await getMenu(app);
    commit('setMenu', menu);
    return menu;
  },

  async fetchArticleList({ commit }, payload) {
    commit('setArticleList', []);
    const articleList = await getArticleList(
      payload.app, payload.page, payload.column, payload.url, payload.id
    );
    commit('setArticleList', articleList);
    return articleList;
  },

  async fetchArticle({ commit }, payload) {
    commit('setArticle', {});
    const article = await getArticle(payload.app, payload.url);
    commit('setArticle', article);
    return article;
  }
};

export default {
  state,
  mutations,
  actions,
};
