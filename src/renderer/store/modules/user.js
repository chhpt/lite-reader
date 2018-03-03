import API from '../../api';
import db from '../../../dataStore';
import colors from '../../themes/color';

const {
  register,
  login,
  logout,
  getFollowAPPs,
  updateUserInfo,
  followAPP,
  cancelFollowAPP,
  getCollectArticles,
  collectArticle,
  cancelCollectArticle
} = API;

const state = {
  account: {},
  followAPPs: [],
  collectArticles: [],
  themeColor: {
    label: '',
    value: ''
  },
  colors: []
};

const getters = {
  account: state => (state.account.id ? state.account : db.get('user.account').value()),
  followAPPs: state => (state.followAPPs.length ? state.followAPPs : db.get('user.follows').value()),
  colors: state => (state.colors.length ? state.colors : colors),
  themeColor: state => {
    if (state.themeColor.value) {
      return state.themeColor;
    }
    const theme = db.get('user.themeColor').value();
    return colors[theme];
  },
  // 过滤掉不收藏的文章
  collectArticles: state => state.collectArticles.filter((e) => !e.delete)
};

const mutations = {
  // 在 mutation 里对本地数据进行更改
  setAccount(state, account) {
    state.account = account || {};
    db.set('user.account', account || {}).write();
  },
  setFollowAPPs(state, followAPPs) {
    state.followAPPs = followAPPs || [];
    db.set('user.follows', followAPPs).write();
  },
  setThemeColor(state, color) {
    state.themeColor = color;
    db.set('user.themeColor', color).write();
  },
  setCollectArticles(state, articles) {
    state.collectArticles = articles || [];
  }
};

const actions = {
  async userRegister({ commit }, payload) {
    const { email, password, username, code } = payload;
    const res = await register(email, username, password, code);
    if (res.status) {
      const { account } = res;
      commit('setAccount', account);
    }
    return res;
  },
  async userLogin({ commit }, payload) {
    const { email, password } = payload;
    const res = await login(email, password);
    if (res.status) {
      const { account } = res;
      commit('setAccount', account);
    }
    return res;
  },
  async userLogout({ commit }) {
    const res = await logout();
    if (res.status) {
      commit('setAccount', {});
      commit('setFollowAPPs', []);
    }
    return res;
  },

  async changeUserInfo({ commit }, payload) {
    const { username, email } = payload;
    const res = await updateUserInfo(username, email);
    if (res.status) {
      const { account } = res;
      commit('setAccount', account);
    }
    return res;
  },

  async fetchFollowAPPs({ commit }) {
    const res = await getFollowAPPs();
    const { apps } = res;
    if (res.status) {
      commit('setFollowAPPs', apps);
    }
    return res;
  },

  async userFollowAPP({ commit }, payload) {
    const { app } = payload;
    const res = await followAPP(app);
    if (res.status) {
      const { apps } = res;
      commit('setFollowAPPs', apps);
    }
    return res;
  },

  async cancelUserFollowAPP({ commit }, payload) {
    const { app } = payload;
    const res = await cancelFollowAPP(app);
    if (res.status) {
      const { apps } = res;
      commit('setFollowAPPs', apps);
    }
    return res;
  },

  async fetchCollectArticles({ commit }) {
    const res = await getCollectArticles();
    if (res.status) {
      commit('setCollectArticles', res.articles);
    }
    return res;
  },

  async collectArticle({ commit, getters }, payload) {
    // 获取当前应用
    const app = getters.currentApp;
    const { article } = payload;
    // 防止文章内容被删除
    const copyArticle = Object.assign({}, article);
    copyArticle.content = null;
    copyArticle.summary = copyArticle.summary.length < 256
      ? copyArticle.summary
      : copyArticle.summary.slice(0, 256);
    copyArticle.appName = app.title;
    const res = await collectArticle(copyArticle);
    if (res.status) {
      commit('setCollectArticles', res.articles);
    }
    return res;
  },

  async cancelCollectArticle({ commit, state }, payload) {
    const { article } = payload;
    const res = await cancelCollectArticle(article.url);
    if (res.status) {
      // 拷贝数组
      const source = state.collectArticles.slice(0);
      // 找到文章，标志删除
      const index = source.findIndex((e) => e.title === article.title);
      source.splice(index, 1);
      // 更新 state
      commit('setCollectArticles', source);
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
