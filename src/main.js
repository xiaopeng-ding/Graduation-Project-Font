// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
// import MuseUI from 'muse-ui';
// import 'muse-ui/dist/muse-ui.css';
import Mui from 'vue-awesome-mui';

import VueCropper from 'vue-cropper'



Vue.use(Mui);

// Vue.use(MuseUI);
Vue.use(ElementUI);
Vue.use(MintUI);
Vue.use(VueCropper);

import store from './store/index.js'

Vue.config.productionTip = false


// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if (store.getters.loginResult.code===0) { // 通过vuex state获取当前的token是否存在,通过一个变量（vuex中或localstorage中），如果为真，那么跳转
//       next();
//     }else {
//       alert('请输入账号和密码')
//       next({
//         path: '/',//如果为假，则重定向到这个路由路劲
//         query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     }
//   }else {
//     next()
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
