<template>
    <div :style="screenSize">
        <div class="header">
            <mt-header title="分组管理">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        
        <div class="search">
            <el-input placeholder="请输入分组名称" v-model="friendGroup.friendGroupName" class="input-with-select">
                <el-button slot="append" @click="addFriendGroup">新建 +</el-button>
            </el-input>
        </div>
        <div class="friendGroups">
            <div v-for="(value,key) in friendGroups" :key="key" @click="changeFriendGroupName(value.id)">
                <mt-cell :title="value.name"></mt-cell>
            </div>
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
            friendGroup:{
                userId:'',
                friendGroupName:'',
            },
            changeFriendGroup:{
                userId:'',
                friendGroupId:'',
                friendGroupName:'',
            },
            friendGroups:[]
        }
    },
    created() {
        //获取登录时的websocket
        this.webSocket = this.$store.getters.webSocket;
        //由于需要实时同步在线状态，所以初始化消息接收监听
        this.webSocket.onmessage = this.websocketonmessage;
        // this.initWebSocket();
        this.height = document.documentElement.clientHeight //获取当前屏幕的高度
        this.screenSize = 'width:'+this.width+'; height:'+this.height+'px';
        Indicator.open({
            spinnerType: 'snake'
        });
        this.$store.dispatch('getFriendGroupsInfo',this.$store.getters.loginResult.object.id).then(res => {
            Indicator.close();
            this.friendGroups = res.data.object;
        })

    },
    methods:{
        backTo(){
            this.$router.push({ path: '/home' })
        },
        addFriendGroup(){
            var name = this.friendGroup.friendGroupName.trim();
            if(name.length==0){
                MessageBox('提示', '名称不能为空');
            }else{
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.friendGroup.friendGroupName = name;
                this.friendGroup.userId = this.$store.getters.loginResult.object.id;
                this.$store.dispatch('addFriendGroup',this.friendGroup).then(res => {
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
        changeFriendGroupName(friendGroupId){
            MessageBox.prompt('请输入分组名称').then(({ value, action }) => {
                // console.log(friendGroupId,value);
                
                if(value == null){
                    MessageBox('提示', "名称不能为空");
                }else{
                    var name = value.trim();
                    if(name.length==0){
                        MessageBox('提示', "名称不能为空");
                    }else{
                        Indicator.open({
                            spinnerType: 'snake'
                        });
                        this.changeFriendGroup.userId=this.$store.getters.loginResult.object.id
                        this.changeFriendGroup.friendGroupId=friendGroupId;
                        this.changeFriendGroup.friendGroupName = name
                        this.$store.dispatch('changeFriendGroupName',this.changeFriendGroup).then(res => {
                            Indicator.close();
                            if(res.data.code===0){
                                this.friendGroups = res.data.object;
                                MessageBox('成功', res.data.msg);
                            }else{
                                MessageBox('失败', res.data.msg);
                            }
                        })
                    }
                }
            });
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
.header {
    height: 7%;
}
.search{
    margin:10px 0 0 0;
    height: 7%;
}
.searchFriend{
    text-align: center;
    margin:20px 0 0 0
}
.friendGroups{
    height: 84%;
    overflow: auto;
}
</style>
