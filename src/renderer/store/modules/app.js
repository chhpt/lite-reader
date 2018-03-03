import API from '../../api';
import db from '../../../dataStore';

const { getMenu, getArticleList, getArticle } = API;

// 对文章按时间排序
const sortArticleList = (articles) => articles.sort((a, b) => {
  if (Date.parse(a.time)) {
    return Date.parse(b.time) - Date.parse(a.time);
  } else if (parseInt(a.time, 10) < Date.now() / 1000) {
    return parseInt(b.time, 10) - parseInt(a.time, 10);
  }
  return 0;
});

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
    const res = await getArticleList(
      type, payload.appId, payload.column
    );
    if (res.status) {
      const { articleList } = res;
      const sortList = sortArticleList(articleList.slice(0));
      commit('setArticleList', sortList);
    }
    return res;
  },

  async fetchMoreArticles({ commit, state }, payload) {
    const type = payload.type ? Number(payload.type) : 0;
    const res = await getArticleList(
      type, payload.appId, payload.column, payload.id, payload.page
    );
    if (res.status) {
      const { articleList } = res;
      const sortList = sortArticleList(articleList);
      const list = state.articleList.concat(sortList);
      commit('setArticleList', list);
    }
    return res;
  },

  async fetchArticle({ commit }, payload) {
    commit('setArticle', {});
    const type = payload.type ? Number(payload.type) : 0;
    const res = await getArticle(
      type, payload.appId, payload.article
    );
    if (res.status) {
      commit('setArticle', res.article);
    }
    return res;
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
