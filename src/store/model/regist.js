import types from '../types.js'
import Axios from 'axios';
import { Message } from 'element-ui';
import { regist } from '@/api/register'

const state = {
    pengRegistResult:{
        code:'',
        msg:''
    }
}

const getters = {
    registResult(state){
        return state.pengRegistResult;
    }
}

const actions = {
    regist({commit},userInfo){
        const username = userInfo.username.trim()
        return new Promise(resolve => {
            regist(username, userInfo.password).then(res => {
                const data = res.data;
                commit(types.GET_REGIST,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    }
}

const mutations = {
    [types.GET_REGIST](state,data){
      state.pengRegistResult = data
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
  