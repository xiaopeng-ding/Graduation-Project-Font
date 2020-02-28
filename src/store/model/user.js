import types from '../types.js'
import Axios from 'axios';
import { Message } from 'element-ui';
import { getUserInfo,
    userInfo,
    addFriend,
    getUserById,
    changeInfo,
    changePassword,
    addFriendGroup,
    findFriendInfo,
    findFriendGroups,
    changeFriendGroup,
    delFriend,
    upload,
    addGroupChat,
    findGroupChat,
    changeGroupChatInfo,
    getGroupChatMember,
    getFriends,
    addNewMember,
    getFriendGroupsInfo,
    changeFriendGroupName,
    exitGroupChat
    } from '@/api/data'

const state = {
    user:{
        code:'',
        msg:'',
        data:{}
    },
    addFriend:{
        code:'',
        msg:'',
        data:{}
    },
    remindDatas:[],
    remindDatasg:[]
}

const getters = {
    user(state){
        return state.user;
    },
    addFriend(state){
        return state.addFriend
    },
    remindDatas(state){
        return state.remindDatas
    },
    remindDatasg(state){
        return state.remindDatasg
    }
}

const actions = {
    getUserInfo({commit},id){
        return new Promise(resolve => {
            getUserInfo(id).then(res => {
                const data = res.data;
                commit(types.GET_USER,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    findFriend({commit},username){
        return new Promise(resolve => {
            userInfo(username).then(res => {
                const data = res.data;
                commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    getUserById({commit},userId){
        return new Promise(resolve => {
            getUserById(userId).then(res => {
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    addFriend({commit},addFriendInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            //userId是自己的id
            addFriend(addFriendInfo.userId,addFriendInfo.friendName).then(res => {
                const data = res.data;
                commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    changeInfo({commit},mineInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            changeInfo(mineInfo.mineId,mineInfo.username,mineInfo.sign).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    changePassword({commit},passwordInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            changePassword(passwordInfo.id,passwordInfo.oldPassword,passwordInfo.password).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    addFriendGroup({commit},friendGroup){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            addFriendGroup(friendGroup.userId,friendGroup.friendGroupName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    findFriendInfo({commit},friendInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            findFriendInfo(friendInfo.mineId,friendInfo.friendName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    findFriendGroups({commit},mineId){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            findFriendGroups(mineId).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    changeFriendGroup({commit},changeInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            changeFriendGroup(changeInfo.mineId,changeInfo.friendName,changeInfo.groupName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    delFriend({commit},friendInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            delFriend(friendInfo.mineId,friendInfo.friendName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    saveRemindDatas({commit},remindDatas){
        commit(types.SET_REMINDDATAS,remindDatas);
    },
    saveRemindDatasg({commit},remindDatasg){
        commit(types.SET_REMINDDATASG,remindDatasg);
    },
    upload(formData){
        return new Promise(resolve => {
            upload(formData).then(res => {
                resolve(res);
            })
        }).catch(err => {
            Message.error('服务器链接异常 '+err);
        })
        
    },
    addGroupChat({commit},groupChat){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            addGroupChat(groupChat.userId,groupChat.groupChatName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    findGroupChat({commit},groupChatId){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName) oldPassword
        return new Promise(resolve => {
            findGroupChat(groupChatId).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    changeGroupChatInfo({commit},groupChatInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            changeGroupChatInfo(groupChatInfo.groupChatId,groupChatInfo.groupChatName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    getGroupChatMember({commit},groupChatId){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            getGroupChatMember(groupChatId).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    getFriends({commit},mineId){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            getFriends(mineId).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    addNewMember({commit},addInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            addNewMember(addInfo.groupChatId,addInfo.friendId).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    getFriendGroupsInfo({commit},id){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            getFriendGroupsInfo(id).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    changeFriendGroupName({commit},changeFriendGroupInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            changeFriendGroupName(changeFriendGroupInfo.userId,changeFriendGroupInfo.friendGroupId,changeFriendGroupInfo.friendGroupName).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    exitGroupChat({commit},exitGroupChatInfo){
        // console.log(addFriendInfo.userId,addFriendInfo.friendName)
        return new Promise(resolve => {
            exitGroupChat(exitGroupChatInfo.userId,exitGroupChatInfo.groupChatId).then(res => {
                const data = res.data;
                // commit(types.GET_ADDFRIEND,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
}

const mutations = {
    [types.GET_USER](state,data){
      state.user = data
    },
    [types.GET_ADDFRIEND](state,data){
        state.addFriend = data
    },
    [types.SET_REMINDDATAS](state,data){
        state.remindDatas = data;
    },
    [types.SET_REMINDDATASG](state,data){
        state.remindDatasg = data;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
  