<template>
    <div class="otherGroupChat" :style="screenSize" >
        <!-- 头部 -->
        
        <div>
             <mt-header title="群聊资料">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <p></p>
        <!-- 群名称 -->
        <div class="avatar">
            <img :src="avatar" style="border-radius: 17px;" height="100" width="100" />
            <p>{{groupChatName}}</p>
        </div>
        <!-- 群成员 -->
        <div>
            <div @click="queryGroupChat">
                <mt-cell
                    title="查看群成员"
                    is-link
                    >
                </mt-cell>
            </div>
            <div @click="addNewMember">
                <mt-cell
                    title="邀请群成员"
                    is-link
                    >
                </mt-cell>
            </div>
        </div>
        <p></p>
        <div>
            <mt-button type="danger" style="width: 100%" @click="exitGroupChat">退出群聊</mt-button>
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
            height:'',
            width:'100%',
            screenSize:'',
            avatar:'',
            exitGroupChatInfo:{
                userId:'',
                groupChatId:'',
            }
        }
    },
    created(){

        //获取上一页面的数据用来返回
        this.groupChatName = this.$route.params.groupChatName;
        this.groupChatId = this.$route.params.groupChatId;
        this.mine = this.$route.params.mine;

        //获取我的信息
        // this.mineInfo.mineId=this.$store.getters.loginResult.object.id
        Indicator.open({
            spinnerType: 'snake'
        });
        this.$store.dispatch('findGroupChat',this.groupChatId).then(res => {
            Indicator.close();
            this.avatar = res.data.object.avatar;
        });

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
            this.$router.push({ 
                name: 'broadcast',
                params:{
                    groupChatId:this.groupChatId,
                    groupChatName: this.groupChatName,
                    mine:this.mine
                }
            })
        },
        queryGroupChat(){
            // console.log("点击查看群成员");
            this.$router.push({ 
                name: 'queryGroupChatMember',
                params:{
                    groupChatId:this.groupChatId,
                    groupChatName: this.groupChatName,
                    mine:this.mine
                }
            })
        },
        addNewMember(){
            this.$router.push({ 
                name: 'addGroupChatMember',
                params:{
                    groupChatId:this.groupChatId,
                    groupChatName: this.groupChatName,
                    mine:this.mine
                }
            })
        },
        exitGroupChat(){
            MessageBox.confirm('确定退出当前群聊？').then(action => {
                console.log("yes");
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.exitGroupChatInfo.userId = this.$store.getters.loginResult.object.id;
                this.exitGroupChatInfo.groupChatId = this.groupChatId;
                this.$store.dispatch('exitGroupChat',this.exitGroupChatInfo).then(res => {
                    Indicator.close();
                    if(res.data.code === 0){
                        MessageBox('成功', res.data.msg);
                        this.$router.push({ path: '/home' })
                    }else{
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
        }
    }
}
</script>

<style scoped>
    .avatar{
        text-align: center;
        width: 100%;
        /* height: 20%; */
    }
    .info{
        width: 100%;
        height: 40%;
    }
    /* .blank{
        height: 5%;
    } */
    .theButton{
        text-align: center;
        width: 100%;
        height: 20%;
    }
</style>
