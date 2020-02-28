<template>
    <div class="oneChat" :style="screenSize" >
        <!-- 头部 -->
        <div>
             <mt-header title="好友信息">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <div class="blank"></div>

        <!-- 头像 -->
        <div class="avatar">
            <img :src="avatar" style="border-radius: 17px;" height="100" width="100" />
        </div>

        <!-- 信息 -->
        <div class="info">
            <mt-field label="昵称" v-model="username" disabled></mt-field>
            <mt-field label="签名" v-model="sign" disabled></mt-field>
            <mt-field label="讯龄" v-model="softAge" disabled></mt-field>
            <mt-field label="好友分组" v-model="friendGroup" disabled></mt-field>
        </div>
        <div class="theButton">
            <mt-button type="primary" style="width: 100%" @click="changeFriendGroup">修改好友分组</mt-button>
            <br>
            <br>
            <mt-button type="danger" style="width: 100%" @click="delFriend">删除好友</mt-button>
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
            mineId:'',
            username:'',
            sign:'',
            friendGroup:'',
            friendInfo:{},
        }
        
    },
    created(){
        Indicator.open({
            spinnerType: 'snake'
        });
        //获取好友的信息 this.id=this.$route.params.id
        this.friendInfo.friendName = this.$route.params.friendName;
        this.friendInfo.mineId = this.$store.getters.loginResult.object.id;
        this.$store.dispatch('findFriendInfo',this.friendInfo).then(res => {
            Indicator.close();
            this.avatar = res.data.object.friendAvatar;
            this.username = res.data.object.friendName;
            this.sign = res.data.object.friendSign;
            this.friendGroup = res.data.object.friendGroupName;
            var timestamp=new Date().getFullYear();
            this.softAge=(new Date().getFullYear()-new Date(res.data.object.friendCreated).getFullYear())+" 岁";
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
            this.$router.go(-1);
        },
        delFriend(){
            MessageBox.confirm('友谊的小船真的要沉了？').then(action => {
                console.log("yes");
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.$store.dispatch('delFriend',this.friendInfo).then(res => {
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
            }).catch( err=> {
                console.log("no");
            });
            
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
            console.log("收到数据："+message.data);
        },
        changeFriendGroup(){
            this.$router.push({
                name:'changeFriendGroup',
                params:{
                    friendName:this.username
                }
            })
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
