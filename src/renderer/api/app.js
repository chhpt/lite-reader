import service from '../utils/service';

const getMenu = (type, appId) => service({
  url: '/get_menu',
  method: 'GET',
  params: {
    type,
    appId
  }
});

const getArticleList = (type, appId, column, id, page) => service({
  url: '/get_article_list',
  method: 'GET',
  params: {
    type,
    appId,
    column,
    id,
    page
  }
});

const getArticle = (type, appId, article) => service({
  url: '/get_article',
  method: 'GET',
  params: {
    type,
    appId,
    article
  }
});

const getCategories = () => service({
  url: '/get_categories',
  method: 'GET'
});

export default {
  getMenu,
  getArticleList,
  getArticle,
  getCategories
};

