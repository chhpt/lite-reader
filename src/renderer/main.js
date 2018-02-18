import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
// import 'element-ui/lib/themes-chalk/index.css';
import './theme/gray/index.css';

import App from './App';
import router from './router';
import store from './store';
import './router/hook';

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
