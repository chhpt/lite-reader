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

export const getArticle = (app, url) => service({
  url: '/get_article',
  method: 'get',
  params: {
    app,
    url
  }
});
export default 0;
