<template>
    <div>
        <div>
            <mt-header title="添加好友">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <div class="search">
            <el-input placeholder="请输入好友昵称" v-model="friend" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="findFriend"></el-button>
            </el-input>
        </div>
        <div v-show="friendShow" class="searchFriend">
            <div>
                <img :src="returnFriend.avatar" style="border-radius: 17px;" height="70" width="70">
            </div>
            <div>
                <h2>{{returnFriend.username}}</h2>
            </div>
            <div>
                <p>{{returnFriend.sign}}</p>
            </div>
            <el-button type="primary" style="width:100%" @click="addFriend">添加</el-button>
        </div>
        <div class="searchFriend" v-show="nullShow">
            <p>啊哦，查无此人，请检查好友昵称~</p>
        </div>
    </div>
    
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
    data(){
        return {
            friend:'',
            addFriendInfo:{
                userId:'',
                friendName:''
            },
            returnFriend:{
                avatar:'../../../static/img/defaultAvatar.jpg',
                username:'测试',
                sign:'测试签名'
            },
            friendShow:false,
            nullShow:false
        }
    },
    created() {
             //获取登录时的websocket
            this.webSocket = this.$store.getters.webSocket;

            //由于需要实时同步在线状态，所以初始化消息接收监听
            this.webSocket.onmessage = this.websocketonmessage;
            // this.initWebSocket();
        },
    methods:{
        backTo(){
            this.$router.push({ path: '/home' })
        },
        findFriend(){
            Indicator.open({
                spinnerType: 'snake'
            });
            this.$store.dispatch('findFriend',this.friend).then(res => {
                Indicator.close();
                if(res.data.code == 0){
                    this.returnFriend.avatar = res.data.object.avatar;
                    this.returnFriend.username = res.data.object.username;
                    this.returnFriend.sign = res.data.object.sign
                    this.addFriendInfo.friendName = res.data.object.username
                    this.friendShow=true
                    this.nullShow=false
                }else{
                    this.friendShow=false
                    this.nullShow=true
                }
            })
        },
        addFriend(){  //单向添加，优化在后期
            Indicator.open({
                spinnerType: 'snake'
            });
            this.addFriendInfo.userId = this.$store.getters.loginResult.object.id;
            this.$store.dispatch('addFriend',this.addFriendInfo).then(res => {
                Indicator.close();
                if(res.data.code === 0){
                    // this.$message({
                    //     message:res.data.msg,
                    //     type:"success"
                    // })
                    MessageBox('成功', res.data.msg);
                    this.$router.push({ path: '/home' })
                }else{
                    // this.$message({
                    //     message:res.data.msg,
                    //     type:"warning"
                    // })
                    MessageBox('错误', res.data.msg);
                }
            })
        },
        websocketonmessage(message){
            const redata = JSON.parse(message.data);
            if(redata.type==="forceOffline"){
                this.webSocket.close();
                this.$router.push({ path: '/' })
                MessageBox('警告', redata.message);
            }else if(redata.type==="warn"){
                MessageBox('警告', redata.message);
            }else if(redata.type==="ann"){
                MessageBox('公告', redata.message);
            }
            // redata.userId;
            // redata.status;
            // console.log(this.friendDatas);
            console.log("收到数据："+message.data);
        }
    }
    
}
</script>

<style lang="less" scoped>
.mint-header {
    height: 50px;
}
.search{
    margin:10px 0 0 0
}
.searchFriend{
    text-align: center;
    margin:20px 0 0 0
}
</style>
