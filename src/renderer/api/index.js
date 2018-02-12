import service from '../utils/service';

export const getAppList = () => service({
  url: '/get_app_list',
  method: 'get'
});

export const getMenu = app => service({
  url: '/get_menu',
  method: 'get',
  params: {
    app
  }
});

export const getArticleList = (app, page, column, url, id) => service({
  url: '/get_article_list',
  method: 'get',
  params: {
    app,
    page,
    column,
    url,
    id
  }
});

export const getArticle = (app, url, payload) => service({
  url: '/get_article',
  method: 'get',
  params: {
    app,
    url,
    payload
  }
});

export const getCategories = () => service({
  url: '/get_categories',
  method: 'get'
});

export const getAppArticleList = (section, id) => service({
  url: '/get_app_article_list',
  method: 'get',
  params: {
    section,
    id
  }
});

export const getAppArticle = (url, section, hasRss) => service({
  url: '/get_app_article',
  method: 'get',
  params: {
    url,
    section,
    hasRss
  }
});
export default 0;
