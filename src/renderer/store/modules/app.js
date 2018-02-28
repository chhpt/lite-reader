import API from '../../api';
import db from '../../../dataStore';

const { getMenu, getArticleList, getArticle } = API;

const state = {
  // 应用是否打开过
  opened: false,
  // 当前应用
  currentApp: {},
  // 选中的栏目（在阅读文章切换路由时记录原选项卡）
  activeItem: {
    title: ''
  },
  // 文章列表
  articleList: [],
  // 栏目列表
  menu: [],
  // 当前浏览的文章
  article: {},
  // 加载
  loading: false,
  // 路由历史
  routeHistory: []
};

const getters = {
  opened: state => (state.opened ? state.opened : db.get('app.opened').value())
};

const mutations = {
  setMenu(state, menu) {
    state.menu = menu || [];
  },
  setActiveItem(state, item) {
    state.activeItem = item;
  },
  setOpenStatus(state, status) {
    state.opened = status;
    db.set('app.opened', status).write();
  },
  setCurrentApp(state, app) {
    state.currentApp = app;
  },
  setArticleList(state, articleList) {
    state.articleList = articleList || [];
  },
  setArticle(state, article) {
    state.article = article;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  addHistory(state, path) {
    state.routeHistory.push(path);
  }
};

const actions = {
  async fetchMenu({ commit }, payload) {
    commit('setMenu', []);
    const type = payload.type ? Number(payload.type) : 0;
    const menu = await getMenu(type, payload.appId);
    commit('setMenu', menu);
    return menu;
  },

  async fetchArticleList({ commit }, payload) {
    commit('setArticleList', []);
    const type = payload.type ? Number(payload.type) : 0;
    const articleList = await getArticleList(
      type, payload.appId, payload.column
    );
    commit('setArticleList', articleList);
    return articleList;
  },

  async fetchMoreArticles({ commit, state }, payload) {
    const type = payload.type ? Number(payload.type) : 0;
    const moreArticles = await getArticleList(
      type, payload.appId, payload.column, payload.id, payload.page
    );
    const articleList = state.articleList.concat(moreArticles);
    commit('setArticleList', articleList);
    return articleList;
  },

  async fetchArticle({ commit }, payload) {
    commit('setArticle', {});
    const type = payload.type ? Number(payload.type) : 0;
    const article = await getArticle(
      type, payload.appId, payload.article
    );
    commit('setArticle', article);
    return article;
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
