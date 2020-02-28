<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import login from './components/login.vue'
  import home from './components/home/home.vue'
  import regist from './components/regist.vue'
  import addFriend from './components/home/addFriend.vue'
  import oneToOne from './components/chat/oneToOne.vue'
  import mineInfo from './components/home/mineInfo.vue'
  import friendInfo from './components/home/friendInfo.vue'
  import changePassword from './components/home/changePassword.vue'
  import addFriendGroup from './components/home/addFriendGroup.vue'
  import changeFriendGroup from './components/home/changeFriendGroup.vue'
  import changeAvatar from './components/home/changeAvatar.vue'
  import addGroupChat from './components/home/addGroupChat.vue'
  import broadcast from './components/chat/broadcast.vue'
  import mineGroupChat from './components/groupChat/mineGroupChat.vue'
  import otherGroupChat from './components/groupChat/otherGroupChat.vue'
  import queryGroupChatMember from './components/groupChat/queryGroupChatMember.vue'
  import addGroupChatMember from './components/groupChat/addGroupChatMember.vue'
  import GroupChatMemberInfo from './components/groupChat/GroupChatMemberInfo.vue'

  //GroupChatMemberInfo.vue addFriendGroup.vue  changeFriendGroup changeAvatar broadcast  otherGroupChat addGroupChatMember managerFriendGroup.vue
   
  export default {
    components:{
      login,
      home,
      regist,
      addFriend,
      oneToOne,
      mineInfo,
      friendInfo,
      changePassword,
      addFriendGroup,
      changeFriendGroup,
      changeAvatar,
      addGroupChat,
      broadcast,
      mineGroupChat,
      otherGroupChat,
      queryGroupChatMember,
      addGroupChatMember,
      GroupChatMemberInfo
    }
  }
</script>

<style>

</style>
