import request from '@/utils/request.js'

//获取用户数据（好友，分组，群等）
export function getUserInfo(userId) {
  const data = {
    userId
  }
  console.log(data);
  return request({
    url: '/user/getUser?userId='+data.userId,
    method: 'get'
  })
}

export function userInfo(username) {
    return request({
        url: '/user/user',
        method: 'post',
        data:'username='+username
    })
}

export function getUserById(userId) {
  return request({
      url: '/user/getUserById',
      method: 'post',
      data:'userId='+userId
  })
}

export function addFriend(userId,friendName) {
    return request({
        url: '/user/addFriend',
        method: 'post',
        data:'userId='+userId+'&friendName='+friendName
    })
}

export function changeInfo(userId,username,sign) {
  return request({
      url: '/user/changeInfo',
      method: 'post',
      data:'userId='+userId+'&username='+username+'&sign='+sign
  })
}

export function changePassword(userId,oldPassword,password) {
  return request({
      url: '/user/changePassword',
      method: 'post',
      data:'userId='+userId+'&oldPassword='+oldPassword+'&password='+password
  })
}

export function addFriendGroup(userId,friendGroupName) {
  return request({
      url: '/user/addFriendGroup',
      method: 'post',
      data:'userId='+userId+'&friendGroupName='+friendGroupName
  })
}

export function findFriendInfo(mineId,friendName) {
  return request({
      url: '/user/findFriendInfo',
      method: 'post',
      data:'mineId='+mineId+'&friendName='+friendName
  })
}

export function findFriendGroups(mineId) {
  return request({
      url: '/user/findFriendGroups',
      method: 'post',
      data:'mineId='+mineId
  })
}

export function changeFriendGroup(mineId,friendName,groupName) {
  return request({
      url: '/user/changeFriendGroup',
      method: 'post',
      data:'mineId='+mineId+'&friendName='+friendName+'&groupName='+groupName
  })
}

export function delFriend(mineId,friendName) {
  return request({
      url: '/user/delFriend',
      method: 'post',
      data:'mineId='+mineId+'&friendName='+friendName
  })
}
//upload

export function upload(fromData) {
  return request({
    url: '/user/testUpload',
    method: 'post',
    fromData
  })
}

export function addGroupChat(userId,groupChatName) {
  return request({
      url: '/user/addGroupChat',
      method: 'post',
      data:'userId='+userId+'&groupChatName='+groupChatName
  })
}

export function findGroupChat(groupChatId) {
  return request({
      url: '/user/findGroupChat',
      method: 'post',
      data:'groupChatId='+groupChatId
  })
}

export function changeGroupChatInfo(groupChatId,groupChatName) {
  return request({
      url: '/user/changeGroupChatInfo',
      method: 'post',
      data:'groupChatId='+groupChatId+'&groupChatName='+groupChatName
  })
}

export function getGroupChatMember(groupChatId) {
  return request({
    url: '/user/getGroupChatMember?groupChatId='+groupChatId,
    method: 'get'
  })
}

export function getFriends(mineId) {
  return request({
    url: '/user/getFriends?userId='+mineId,
    method: 'get'
  })
}

export function addNewMember(groupChatId,friendId) {
  return request({
      url: '/user/addNewMember',
      method: 'post',
      data:'groupChatId='+groupChatId+'&friendId='+friendId
  })
}

export function getFriendGroupsInfo(userId) {
  return request({
    url: '/user/getFriendGroupsInfo?userId='+userId,
    method: 'get'
  })
}

export function changeFriendGroupName(userId,friendGroupId,friendGroupName) {
  return request({
      url: '/user/changeFriendGroupName',
      method: 'post',
      data:'userId='+userId+'&friendGroupId='+friendGroupId+'&friendGroupName='+friendGroupName
  })
}

export function exitGroupChat(userId,groupChatId) {
  return request({
      url: '/user/exitGroupChat',
      method: 'post',
      data:'userId='+userId+'&groupChatId='+groupChatId
  })
}