<template>
    <div>
        <div>
            <mt-header title="选择好友分组">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <div class="search">
            <mt-picker :slots="slots"  @change="onValuesChange" ></mt-picker>
        </div>
        <div>
            <div class="theButton">
                <mt-button type="primary" style="width: 100%" @click="changeFriendGroup">修改</mt-button>
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
            changeInfo:{
                mineId:'',
                friendName:'',
                groupName:'',
            },
            slots:[{values: []}]
        };
    },
    created() {
             //获取登录时的websocket
            this.webSocket = this.$store.getters.webSocket;
            //由于需要实时同步在线状态，所以初始化消息接收监听
            this.webSocket.onmessage = this.websocketonmessage;
            // this.initWebSocket();

            this.changeInfo.mineId = this.$store.getters.loginResult.object.id;

            this.changeInfo.friendName = this.$route.params.friendName;

            Indicator.open({
                spinnerType: 'snake'
            });
            this.$store.dispatch('findFriendGroups',this.changeInfo.mineId).then(res => {
                Indicator.close();
                for(var i=0;i<res.data.object.length;i++){
                    this.slots[0].values.push(res.data.object[i].name);
                }
                console.log(res.data);
            })
        },
    methods:{
        backTo(){
            this.$router.push({ path: '/home' })
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
        onValuesChange(picker, values) {
            this.changeInfo.groupName = values[0];
        },
        changeFriendGroup(){
            Indicator.open({
                spinnerType: 'snake'
            });
            this.$store.dispatch('changeFriendGroup',this.changeInfo).then(res => {
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
.theButton{
    text-align: center;
    width: 100%;
    height: 20%;
}
</style>
