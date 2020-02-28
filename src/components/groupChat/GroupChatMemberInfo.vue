<template>
    <div class="oneChat" :style="screenSize" >
        <!-- 头部 -->
        <div>
             <mt-header title="成员信息">
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
        </div>
        <div class="theButton">
            <mt-button type="primary" style="width: 100%" @click="addFriend" v-if="!isFriend">加为好友</mt-button>
            <br>
            <br>
            <mt-button type="primary" style="width: 100%" @click="backTo">确定</mt-button>
            <br>
            <br>
            <mt-button type="danger" style="width: 100%" @click="exitGroupChat" v-if="mine">删除群成员</mt-button>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
    
    data(){
        return {
            groupChatName:'',
            groupChatId:'',
            mine:'',
            friendId:'',
            height:'',
            width:'100%',
            screenSize:'',
            avatar:'',
            mineId:'',
            username:'',
            sign:'',
            friendInfo:{},
            isFriend:true,
            addFriendInfo:{},
            exitGroupChatInfo:{},
        }
        
    },
    created(){

        this.height = document.documentElement.clientHeight //获取当前屏幕的高度
        //  console.log(this.height)
        this.screenSize = 'width:'+this.width+'; height:'+this.height+'px';

         //获取登录时的websocket
        this.webSocket = this.$store.getters.webSocket;

        //由于需要实时同步在线状态，所以初始化消息接收监听
        this.webSocket.onmessage = this.websocketonmessage;
        // this.initWebSocket();


        //获取成员的信息和群聊信息
        this.groupChatName = this.$route.params.groupChatName;
        this.groupChatId = this.$route.params.groupChatId;
        this.mine = this.$route.params.mine;
        this.friendId = this.$route.params.friendId;
        this.avatar = this.$route.params.friendAvatar;
        this.username = this.$route.params.friendName;
        this.sign = this.$route.params.friendSgin;

        this.mineId = this.$store.getters.loginResult.object.id;

        this.friendInfo.mineId = this.mineId
        this.friendInfo.friendName = this.username
        Indicator.open({
            spinnerType: 'snake'
        });
        this.$store.dispatch('findFriendInfo',this.friendInfo).then(res => {
            Indicator.close();
            if(res.data.code === 0){
                this.isFriend = true;  //是好友
            }else{
                this.isFriend = false;  //不是好友
            }
        })

        
    },
    methods:{
        backTo(){
            this.$router.push({ 
                name: 'queryGroupChatMember',
                params:{
                    groupChatId:this.groupChatId,
                    groupChatName: this.groupChatName,
                    mine:this.mine
                }
            })
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
        },
        addFriend(){
            Indicator.open({
                spinnerType: 'snake'
            });
            this.addFriendInfo.userId = this.mineId;
            this.addFriendInfo.friendName = this.username;
            this.$store.dispatch('addFriend',this.addFriendInfo).then(res => {
                Indicator.close();
                if(res.data.code === 0){
                    // this.$message({
                    //     message:res.data.msg,
                    //     type:"success"
                    // })
                    MessageBox('成功', res.data.msg);
                    this.$router.push({ 
                        name: 'queryGroupChatMember',
                        params:{
                            groupChatId:this.groupChatId,
                            groupChatName: this.groupChatName,
                            mine:this.mine
                        }
                    })
                }else{
                    // this.$message({
                    //     message:res.data.msg,
                    //     type:"warning"
                    // })
                    MessageBox('错误', res.data.msg);
                }
            })
        },
        exitGroupChat(){
            MessageBox.confirm('将成员删除？').then(action => {
                console.log("yes");
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.exitGroupChatInfo.userId = this.friendId;
                this.exitGroupChatInfo.groupChatId = this.groupChatId;
                this.$store.dispatch('exitGroupChat',this.exitGroupChatInfo).then(res => {
                     Indicator.close();
                    if(res.data.code === 0){
                        MessageBox('成功', "成功将该成员删除");
                        this.$router.push({ 
                            name: 'queryGroupChatMember',
                            params:{
                                groupChatId:this.groupChatId,
                                groupChatName: this.groupChatName,
                                mine:this.mine
                            }
                        })
                    }else{
                        MessageBox('错误', res.data.msg);
                    }
                })
            }).catch( err=> {
                console.log("no");
            });
        },
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
