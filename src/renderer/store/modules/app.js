import API from '../../api';
const { getMenu, getArticleList, getArticle, getAppArticle } = API;

const state = {
  // 当前栏目
  activeItem: {
    title: '',
    url: ''
  },
  // 应用名
  name: '',
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
  setAppName(state, name) {
    state.name = name;
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

  async fetchMoreArticles({ commit, state }, payload) {
    const moreArticles = await getArticleList(
      payload.app, payload.page, payload.column, payload.url, payload.id
    );
    const articleList = state.articleList.concat(moreArticles);
    commit('setArticleList', articleList);
    return articleList;
  },

  async fetchArticle({ commit }, payload) {
    commit('setArticle', {});
    const article = await getArticle(payload.app, payload.url, {
      id: payload.id,
      category: payload.category
    });
    commit('setArticle', article);
    return article;
  },

  async fetchAppArticle({ commit }, payload) {
    const { url, section, hasRss } = payload;
    const article = await getAppArticle(url, section, hasRss);
    commit('setArticle', article);
    return article;
  }
};

export default {
  state,
  mutations,
  actions,
};
