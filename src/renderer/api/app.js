import service from '../utils/service';

const getMenu = app => service({
  url: '/get_menu',
  method: 'GET',
  params: {
    app
  }
});

const getArticleList = (app, page, column, url, id) => service({
  url: '/get_article_list',
  method: 'GET',
  params: {
    app,
    page,
    column,
    url,
    id
  }
});

const getArticle = (app, url, payload) => service({
  url: '/get_article',
  method: 'GET',
  params: {
    app,
    url,
    payload
  }
});

const getCategories = () => service({
  url: '/get_categories',
  method: 'GET'
});

const getAppArticleList = (section, id) => service({
  url: '/get_app_article_list',
  method: 'GET',
  params: {
    section,
    id
  }
});

const getAppArticle = (url, section, hasRss) => service({
  url: '/get_app_article',
  method: 'GET',
  params: {
    url,
    section,
    hasRss
  }
});

export default {
  getMenu,
  getArticleList,
  getArticle,
  getCategories,
  getAppArticleList,
  getAppArticle
};
