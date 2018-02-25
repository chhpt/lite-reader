import API from '../../api';

const { getMenu, getArticleList, getArticle } = API;

const state = {
  // 当前栏目
  activeItem: {
    title: '',
    url: ''
  },
  // 当前应用
  currentApp: {},
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

const mutations = {
  setMenu(state, menu) {
    state.menu = menu || [];
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
  setActiveItem(state, item) {
    state.activeItem = item;
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
  mutations,
  actions,
};
