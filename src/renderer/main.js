import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import db from '../dataStore';

import App from './App';
import router from './router';
import store from './store';
import './router/hook';

/* eslint-disable */
const theme = db.get('user.themeColor').value();
import(`./themes/${theme}/index.css`);
/* eslint-enable */

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.use(ElementUI);

Vue.prototype.$bus = new Vue();
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
