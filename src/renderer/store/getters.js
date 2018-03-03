const getters = {
  currentApp: state => state.app.currentApp,
  menu: state => state.app.menu,
  articleList: state => state.app.articleList,
  article: state => state.app.article,
  activeItem: state => state.app.activeItem,
  loading: state => state.app.loading,
  routeHistory: state => state.app.routeHistory,
  apps: state => state.categories.apps
};

export default getters;
