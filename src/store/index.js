import Vue from 'vue'
import Vuex from 'vuex'
import regist from './model/regist.js'
import login from './model/login.js'
import user from './model/user.js'

Vue.use(Vuex);

export default new Vuex.Store ({
   modules:{
    regist,
    login,
    user
   }
})
