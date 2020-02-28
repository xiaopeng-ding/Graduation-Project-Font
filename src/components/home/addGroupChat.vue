<template>
    <div>
        <div>
            <mt-header title="新建群聊">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <div class="search">
            <el-input placeholder="请输入群聊名称" v-model="groupChat.groupChatName" class="input-with-select">
                <el-button slot="append" @click="addGroupChat">新建 +</el-button>
            </el-input>
        </div>
    </div>
    
</template>

<script>

import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {

    data(){
        return {
            groupChat:{
                userId:'',
                groupChatName:'',
            }
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
        addGroupChat(){
            var name = this.groupChat.groupChatName.trim();
            if(name.length==0){
                MessageBox('提示', '名称不能为空');
            }else{
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.groupChat.groupChatName = name;
                this.groupChat.userId = this.$store.getters.loginResult.object.id;
                this.$store.dispatch('addGroupChat',this.groupChat).then(res => {
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
        websocketonmessage(message){
            const redata = JSON.parse(message.data);
            if(redata.type==="forceOffline"){  //强制下线（包括重复登录的下线、和后台管理系统的强制下线）
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
