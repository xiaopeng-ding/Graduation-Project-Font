<template>
    <div :style="screenSize" >
        <!-- 头部 -->
        <div>
            <mt-header title="邀请新成员">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <!-- 遍历好友 -->
        <div class="groupChatMemberStyle">
            <div class="userStyle" v-for="(v,k) in members" :key="k"  @click="addNewMember(v.id)">
                <div class="avatarStyle">
                    <img :src="v.avatar" style="border-radius: 17px;" height="45" width="45">
                </div>
                <div class="infoStyle">
                    <div>
                        <span class="nameStyle">{{v.username}}</span>
                    </div>
                    <div>
                        <span :class="{'statusStyle':style(v)}">[{{v.status}}]</span>
                        <span>{{v.sign}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
  export default {
    data() {
      return {
            height:'',
            width:'100%',
            groupChatName:'',
            groupChatId:'',
            mine:'',
            mineId:'',
            members:[],
            // screenSize:'',
            webSocket:{},
            addInfo:{
                groupChatId:'',
                friendId:''
            }
        }
    },
    created(){
        this.mineId=this.$store.getters.loginResult.object.id;
        //向后台请求的数据时的参数和返回原页面的参数
        this.groupChatName = this.$route.params.groupChatName;
        this.groupChatId = this.$route.params.groupChatId;
        this.mine = this.$route.params.mine;


        Indicator.open({
            spinnerType: 'snake'
        });
        //获取自身好友
        this.$store.dispatch('getFriends',this.mineId).then(res => {
            Indicator.close();
            var newMembers = res.data.members;
            for(var i=0;i<newMembers.length;i++){
                if(newMembers[i].sign.length>15){
                    var newSign=newMembers[i].sign.substring(0,15)+"...";
                    newMembers[i].sign=newSign;
                }
            }
            this.members = newMembers;
        })
        // this.myForm.id = this.$store.getters.loginResult.object.id;
        this.height = document.documentElement.clientHeight //获取当前屏幕的高度
        //  console.log(this.height)
        this.screenSize = 'width:'+this.width+'; height:'+this.height+'px';

        //获取当前登录的webSocket对象
        this.webSocket = this.$store.getters.webSocket;
        
        this.webSocket.onmessage = this.websocketonmessage;
        // this.initWebSocket();

    },
    methods: {
        backTo(){
            if(this.mine){
                this.$router.push({ 
                    name: 'mineGroupChat',
                    params:{
                        groupChatId:this.groupChatId,
                        groupChatName: this.groupChatName,
                        mine:this.mine
                    }
                })
            }else{
                this.$router.push({ 
                    name: 'otherGroupChat',
                    params:{
                        groupChatId:this.groupChatId,
                        groupChatName: this.groupChatName,
                        mine:this.mine
                    }
                })
            }
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
        style(v){
            return v.status=="online"
        },
        addNewMember(v){
            Indicator.open({
                spinnerType: 'snake'
            });
            this.addInfo.friendId=v;
            this.addInfo.groupChatId=this.groupChatId;
            this.$store.dispatch('addNewMember',this.addInfo).then(res => {
                Indicator.close();
                if(res.data.code === 0){
                    // this.$message({
                    //     message:res.data.msg,
                    //     type:"success"
                    // })
                    MessageBox('成功', res.data.msg);
                    if(this.mine){
                        this.$router.push({ 
                            name: 'mineGroupChat',
                            params:{
                                groupChatId:this.groupChatId,
                                groupChatName: this.groupChatName,
                                mine:this.mine
                            }
                        })
                    }else{
                        this.$router.push({ 
                            name: 'otherGroupChat',
                            params:{
                                groupChatId:this.groupChatId,
                                groupChatName: this.groupChatName,
                                mine:this.mine
                            }
                        })
                    }
                }else{
                    // this.$message({
                    //     message:res.data.msg,
                    //     type:"warning"
                    // })
                    MessageBox('错误', res.data.msg);
                }
            })
        }
    }
  }
</script>

<style lang="less" scoped>
    .blank{
        height: 8%;
    }
    .passwordForm{
        height: 30%;
    }
    .userStyle{
        width: 100%;
        float: left;
    }
    .avatarStyle{
        width: 49px;
        float: left;
    }
    .infoStyle{
        float: left;
    }
    .nameStyle{
        font-family: serif;
        font-size: 14px;
    }
    .statusStyle{
        color: green
    }
    .groupChatMemberStyle{
        height: 90%;
        overflow: auto;
    }
</style>
