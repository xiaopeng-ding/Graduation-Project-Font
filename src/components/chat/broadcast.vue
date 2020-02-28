<template>
    <div class="broadcast" :style="screenSize" > 
        <div class="oneHeader">
            <mt-header :title="groupChatName">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
                <div slot="right" @click="more">
                    <mt-button icon="more" ></mt-button>
                </div>
            </mt-header>
        </div>

        <!-- 消息区 -->
        <div class="oneMessage" id="messages">
            <div v-for="(value,key) in receiveMessages" :key="key" style="left:0px" :class="{'messageStyle_mine':value.mineStyle,'messageStyle_friend':!value.mineStyle}">
                <div :class="{'messageStyle_avatar_mine':value.mineStyle,'messageStyle_avatar_friend':!value.mineStyle}">
                    <img :src="value.showAvatar" style="border-radius: 17px;" height="45" width="45">
                </div>
                <!-- class="messageStyle_message"  -->
                <div :class="{'messageStyle_message_mine':value.mineStyle,'messageStyle_message_friend':!value.mineStyle}">
                    <div :class="{'messageStyle_content_mine':value.mineStyle,'messageStyle_content_friend':!value.mineStyle}">
                        <p >{{value.message}}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 输入框 -->
        <div class="oneInput">
            <el-input v-model="message">
                <el-button slot="append" icon="el-icon-check" @click="sendMessage" ></el-button>
            </el-input>
        </div>
    </div>
</template>

<script>

import { MessageBox } from 'mint-ui';

// import host from '@/utils/webSocket_con.js'
export default {
    data(){
        return {
            mineId:'',
            groupChatId:'',
            width:'100%',
            height:'',
            message:'',
            screenSize:'',
            groupChatName:'',
            mine:'',
            sendMessages:{
                from:'',
                type:'',  //消息类型
                showAvatar:'',
                mine:{
                    mineId:'',
                    mineName:'',
                    mineAvatar:''
                },
                groupChat:{
                    groupChatId:'',
                    groupChatName:'',
                    groupChatAvatar:''
                },
                message:'',
                mineStyle:true,
            },
            receiveMessages:[],
            webSocket:{}
        }
    },
    created(){
        this.height = document.documentElement.clientHeight //获取当前屏幕的高度
        //  console.log(this.height)
        this.screenSize = 'width:'+this.width+'; height:'+this.height+'px';
        this.mineId = this.$store.getters.loginResult.object.id;
        this.groupChatName = this.$route.params.groupChatName;
        this.groupChatId = this.$route.params.groupChatId;
        this.mine = this.$route.params.mine;

        //获取登录时的websocket
        this.webSocket = this.$store.getters.webSocket;

        //获取群聊的信息
        this.$store.dispatch('findGroupChat',this.groupChatId).then(res => {
            // this.friendId = res.data.object.id;
            this.sendMessages.groupChat.groupChatId = this.groupChatId
            this.sendMessages.groupChat.groupChatName = res.data.object.name;
            this.sendMessages.groupChat.groupChatAvatar = res.data.object.avatar;
            // this.sendMessages.groupChat.mine = this.mine;

        });

        //获取要发送方的信息
        this.$store.dispatch('getUserInfo',this.mineId).then(res => {
            this.sendMessages.from = res.data.data.mine.id;
            this.sendMessages.mine.mineId = res.data.data.mine.id;
            this.sendMessages.mine.mineAvatar = res.data.data.mine.avatar;
            this.sendMessages.mine.mineName = res.data.data.mine.username;
        })


        //初始化socket里的方法
        this.webSocket.onmessage = this.websocketonmessage;
        this.webSocket.onopen = this.websocketonopen;
        this.webSocket.onerror = this.websocketonerror;
        this.webSocket.onclose = this.websocketclose;
    },
    methods: {
        websocketonopen(){ //连接建立之后执行send方法发送数据
            console.log("链接成功")
        },
        websocketonerror(){//连接建立失败重连
            this.initWebSocket();
        },
        websocketonmessage(message){ //数据接收
            const redata = JSON.parse(message.data);
            if(redata.type==="groupChat"&&redata.groupChat.groupChatId==this.groupChatId){ //进行消息的最后的处理，筛选出当前群聊的消息，避免出现消息的窜群的情况
                console.log(redata.from===this.mineId)
                // this.sendMessages.mineStyle=(redata.from===this.mineId);
                redata.mineStyle=(redata.from===this.mineId);  //通过接受到的数据来更改样式（判定是自己发的还是收到朋友发的）
                redata.showAvatar=(redata.mine.mineAvatar);
                this.receiveMessages.push(redata)
            }else if(redata.type==="forceOffline"){
                this.webSocket.close();
                this.$router.push({ path: '/' })
                MessageBox('警告', redata.message);
            }else if(redata.type==="warn"){
                MessageBox('警告', redata.message);
            }else if(redata.type==="ann"){
                MessageBox('公告', redata.message);
            }
            console.log("收到数据："+message.data)
        },
        websocketclose(e){  //关闭
            console.log('断开连接',e);
        },
        sendMessage(){//数据发送
            if(this.message!=null&&this.message.length!=0){
                this.sendMessages.message = this.message;
                this.sendMessages.showAvatar = this.sendMessages.mine.mineAvatar;
                
                this.sendMessages.type = "groupChat";
                // this.sendMessages.timestamp = new Date().getTime();
                const strSendMessages = JSON.stringify(this.sendMessages)
                this.webSocket.send(strSendMessages);
                const mineSendMessages = JSON.parse(strSendMessages);
                this.receiveMessages.push(mineSendMessages); //讲自己发送的消息添加到显示消息框中
                this.message=''
            }
        },
        backTo(){
            this.$router.push({ path: '/home' })
        },
        scrollToBottom(){
            //让滑块都在最低端的解决方案
            this.$nextTick(() => {
                var div = document.getElementById('messages')
                div.scrollTop = div.scrollHeight
            })
        },
        more(){
            // console.log("点击");
            if(this.mine){
                console.log("我的群")
                this.$router.push({ 
                    name: 'mineGroupChat',
                    params:{
                        groupChatId:this.groupChatId,
                        groupChatName: this.groupChatName,
                        mine:this.mine
                    }
                })
            }else{
                console.log("别人的群")
                this.$router.push({ 
                    name: 'otherGroupChat',
                    params:{
                        groupChatId:this.groupChatId,
                        groupChatName: this.groupChatName,
                        mine:this.mine
                    }
                })
            }

        }
    },
    
    watch:{
        //让滑块都在最低端的解决方案
        'message': 'scrollToBottom'
    },
    
}
</script>

<style lang="less" scoped>
    .oneHeader{
        background-color: #26a2ff;
        width: 100%;
        height: 6%;
    }
    .oneMessage{
        // background-color: aqua;
        border: 1px solid rgb(185, 185, 185);
        width: 100%;
        height: 85%;
        overflow: auto;
    }
    .oneInput{
        width: 100%;
        height: 9%;
    }
    
    .messageStyle_mine{
        width: 100%;
        float: right;
        // float: left;
    }
    .messageStyle_message_mine{
        // float: left;
        float: right;
        width: 80%;
    }
    .messageStyle_content_mine{
        background-color: deepskyblue;
        width: fit-content;
        color: white;
        border: double;
        border-radius: 7px;
        float: right;
        // float: left;
    }
    .messageStyle_avatar_mine{
        // float: left;
        float: right;
    }


    .messageStyle_friend{
        width: 100%;
        // float: right;
        float: left;
    }
    .messageStyle_message_friend{
        float: left;
        // float: right;
        width: 80%;
    }
    .messageStyle_content_friend{
        background-color: deepskyblue;
        width: fit-content;
        color: white;
        border: double;
        border-radius: 7px;
        // float: right;
        float: left;
    }
    .messageStyle_avatar_friend{
        float: left;
        // float: right;
    }
</style>
