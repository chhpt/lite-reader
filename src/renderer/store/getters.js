const getters = {
  name: state => state.app.name,
  appList: state => state.app.appList,
  menu: state => state.app.menu,
  articleList: state => state.app.articleList,
  article: state => state.app.article,
  activeItem: state => state.app.activeItem,
  loading: state => state.app.loading,
  categories: state => state.categories.categories,
  appArticleList: state => state.detail.appArticleList
};

export default getters;
