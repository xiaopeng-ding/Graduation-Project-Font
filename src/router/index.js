import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'



Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'Login',
      path:'/',
      component: Login //() => import('@/components/Login')
    },
    {
      name:'home',
      path:'/home',
      component: () => import('@/components/home/home.vue')
    },
    {
      name:'regist',
      path:'/regist',
      component: () => import('@/components/regist.vue')
    },
    {
      name:'addFriend',
      path:'/addFriend',
      component: () => import('@/components/home/addFriend.vue')
    },
    {
      name:'one',
      path:'/one',
      component: () => import('@/components/chat/oneToOne.vue')
    },
    {
      name:'mineInfo',
      path:'/mineInfo',
      component: () => import('@/components/home/mineInfo.vue')
    },
    {
      name:'friendInfo',
      path:'/friendInfo',
      component: () => import('@/components/home/friendInfo.vue')
    },
    {
      name:'changePassword',
      path:'/changePassword',
      component: () => import('@/components/home/changePassword.vue')
    },
    {
      name:'addFriendGroup',
      path:'/addFriendGroup',
      component: () => import('@/components/home/addFriendGroup.vue')
    },
    {
      name:'changeFriendGroup',
      path:'/changeFriendGroup',
      component: () => import('@/components/home/changeFriendGroup.vue')
    },
    {
      name:'changeAvatar',
      path:'/changeAvatar',
      component: () => import('@/components/home/changeAvatar.vue')
    },
    {
      name:'addGroupChat',
      path:'/addGroupChat',
      component: () => import('@/components/home/addGroupChat.vue')
    },
    {
      name:'broadcast',
      path:'/broadcast',
      component: () => import('@/components/chat/broadcast.vue')
    },
    {
      name:'mineGroupChat',
      path:'/mineGroupChat',
      component: () => import('@/components/groupChat/mineGroupChat.vue')
    },
    {
      name:'otherGroupChat',
      path:'/otherGroupChat',
      component: () => import('@/components/groupChat/otherGroupChat.vue')
    },
    {
      name:'queryGroupChatMember',
      path:'/queryGroupChatMember',
      component: () => import('@/components/groupChat/queryGroupChatMember.vue')
    },
    {
      name:'addGroupChatMember',
      path:'/addGroupChatMember',
      component: () => import('@/components/groupChat/addGroupChatMember.vue')
    },
    {
      name:'GroupChatMemberInfo',
      path:'/GroupChatMemberInfo',
      component: () => import('@/components/groupChat/GroupChatMemberInfo.vue')
    }
  ]
})
