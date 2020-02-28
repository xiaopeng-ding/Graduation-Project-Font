<template>
    <div class="oneChat" :style="screenSize" >
        <!-- 头部 -->
        <div>
             <mt-header title="个人信息">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <div class="blank"></div>
        <!-- 头像 -->
        <div class="avatar" @click="changeAvatar">
            <img :src="avatar" style="border-radius: 17px;" height="100" width="100" />
        </div>

        <!-- 信息 -->
        <div class="info">
            <mt-field label="昵称" placeholder="请输入昵称" v-model="mineInfo.username"></mt-field>
            <mt-field label="签名" placeholder="请输入签名" v-model="mineInfo.sign"></mt-field>
            <mt-field label="讯龄" v-model="softAge" disabled></mt-field>
        </div>
        <div class="theButton">
            <mt-button type="primary" style="width: 100%" @click="changeInfo">修改个人信息</mt-button>
            <br>
            <br>
            <mt-button type="primary" style="width: 100%" @click="changePassword">修改密码
                <img src="http://49.4.114.15/avatar/passwd.png" height="20" width="20" slot="icon">
            </mt-button>
        </div>
    </div>
</template>

<script>

import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';

export default {
    data(){
        return {
            height:'',
            width:'100%',
            screenSize:'',
            avatar:'',
            softAge:'0 岁',
            mineInfo:{
                mineId:'',
                username:'',
                sign:'',
            }
        }
    },
    created(){
        //获取我的信息
        this.mineInfo.mineId=this.$store.getters.loginResult.object.id

        // this.mineId=3
        Indicator.open({
            spinnerType: 'snake'
        });
        this.$store.dispatch('getUserById',this.mineInfo.mineId).then(res => {
            Indicator.close();
            // this.sendMessages.from = res.data.data.mine.id;
            this.avatar = res.data.object.avatar;
            this.mineInfo.username = res.data.object.username;
            this.mineInfo.sign = res.data.object.sign;
            var timestamp=new Date().getFullYear();
            this.softAge=(new Date().getFullYear()-new Date(res.data.object.created).getFullYear())+" 岁";
            // console.log(new Date().getFullYear()+"    "+new Date(res.data.object.created).getFullYear());
        })

        this.height = document.documentElement.clientHeight //获取当前屏幕的高度
        //  console.log(this.height)
        this.screenSize = 'width:'+this.width+'; height:'+this.height+'px';

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
        changeInfo(){
            var name = this.mineInfo.username.trim();
            if(name.length==0){
                MessageBox('提示', '昵称不能为空');
            }else{
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.mineInfo.username = name;
                this.$store.dispatch('changeInfo',this.mineInfo).then(res => {
                    Indicator.close();
                    if(res.data.code===0){
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
            }
        },
        changePassword(){
            this.$router.push({ path: '/changePassword' })
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
        },
        changeAvatar(){
            this.$router.push({ path: '/changeAvatar' })
        }
    }
}
</script>

<style scoped>
    .avatar{
        text-align: center;
        width: 100%;
        height: 20%;
    }
    .info{
        width: 100%;
        height: 40%;
    }
    .blank{
        height: 5%;
    }
    .theButton{
        text-align: center;
        width: 100%;
        height: 20%;
    }
</style>
