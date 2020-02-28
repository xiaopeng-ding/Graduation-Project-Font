<template>
    <div class="homeAll">
        <!-- 底层选项卡对应的组件 -->
        <div>
            <mt-tab-container v-model="baseSelected">
                <!-- 联系人组件 -->
                <mt-tab-container-item id="联系人">
                    <div>
                        <div>
                            <mt-header title="好友">
                                <div slot="left" @click="userInfo">
                                    <img :src="imgUrl" style="border-radius: 17px;" height="55" width="55" />
                                </div>
                                <div slot="right" @click="logout">
                                    <mt-button>注销</mt-button>
                                </div>
                            </mt-header>
                        </div>
                        <div class="option">
                            <mt-cell
                                title="添加好友"
                                to="/addFriend"
                                is-link
                                >
                            </mt-cell>
                            <mt-cell
                                title="分组管理"
                                to="/addFriendGroup"
                                is-link
                                >
                            </mt-cell>
                            <mt-cell
                                title="创建群聊"
                                to="/addGroupChat"
                                is-link
                                >
                            </mt-cell>
                        </div>
                        <div>
                            <!-- 中部的联系人类型选项卡 -->
                            <mt-navbar v-model="selected">
                                <mt-tab-item id="好友">好友</mt-tab-item>
                                <mt-tab-item id="群聊">群聊</mt-tab-item>
                            </mt-navbar>
                            <!-- tab-container 联系人类型组件 -->
                            <div class="friendData">
                                <mt-tab-container v-model="selected">
                                    <mt-tab-container-item id="好友">
                                        <el-collapse v-model="friendDatas.id" @change="handleChange" >
                                            <div v-for="(value,key) in friendDatas" :key="key">
                                                <el-collapse-item  :title="value.groupname" :name="value.groupname" >
                                                    <div class="userStyle" v-for="(v,k) in value.friends" :key="k" >
                                                        <div class="avatarStyle">
                                                            <img :src="v.avatar" style="border-radius: 17px;" height="45" width="45" @click="showUserInfo(v.username)" >
                                                        </div>
                                                        <div class="infoStyle" @click="oneChat(v.username)">
                                                            <div>
                                                                <span class="nameStyle">{{v.username}}</span>
                                                            </div>
                                                            <div>
                                                                <span :class="{'statusStyle':style(v)}">[{{v.status}}]</span>
                                                                <span>{{v.sign}}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-collapse-item>
                                            </div>
                                        </el-collapse>
                                    </mt-tab-container-item>
                                    <mt-tab-container-item id="群聊">
                                        <div class="userStyle" v-for="(value,key) in groupChat" :key="key" @click="Chats(value.id,value.groupChatName,value.mine)">
                                            <div class="avatarStyle">
                                                <img :src="value.groupChatAvatar" style="border-radius: 17px;" height="45" width="45" >
                                            </div>
                                            <div class="infoStyle">
                                                <span>{{value.groupChatName}}</span>
                                            </div>
                                            <!-- <mt-cell :title="value.groupChatName" /> -->
                                        </div>
                                    </mt-tab-container-item>
                                </mt-tab-container>    
                            </div>
                        </div>
                    </div>
                </mt-tab-container-item>
                <!-- 消息组件 -->
                <mt-tab-container-item id="消息">
                    <div class="newsMineHeader">
                        <div class="newsMineAvatar" @click="userInfo">
                            <img :src="imgUrl" class="avatarNews" style="border-radius: 17px;" height="55" width="55" />
                        </div>
                        <div class="newsHeaderTitle">
                            <span>消息</span>
                        </div>
                        <!-- <div class="newsHeaderButton" @click="backTo">
                            <span>返回&nbsp;&nbsp;></span>
                        </div> -->
                    </div>
                    <div class="newsTab">
                        <div class="newsStyle" v-for="(value,key) in remindDatas" :key="key" >
                            <div class="newsAvatarStyle">
                                <img :src="value.mine.mineAvatar" style="border-radius: 17px;" height="45" width="45" @click="showUserInfo(value.mine.mineName)" >
                            </div>
                            <div class="newsInfoStyle" @click="oneChat(value.mine.mineName)">
                                <div>
                                    <span class="newsNameStyle">{{value.mine.mineName}}</span>
                                </div>
                                <div style="color:rgb(151, 151, 151)">
                                    <span>{{value.message}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="newsStyleg" v-for="(value,k) in remindDatasg" :key="k" >
                            <div class="newsAvatarStyleg">
                                <img :src="value.groupChat.groupChatAvatar" style="border-radius: 17px;" height="45" width="45" >
                            </div>
                            <div class="newsInfoStyleg" >
                                <div>
                                    <span class="newsNameStyleg">{{value.groupChat.groupChatName}}</span>
                                </div>
                                <div style="color:rgb(151, 151, 151)">
                                    <span>{{value.mine.mineName}}:{{value.message}}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <!-- 底层的选项卡 -->
        <div class="baseTab">
            <mt-tabbar v-model="baseSelected">
                <mt-tab-item id="消息">
                    <img slot="icon" src="../../../static/img/news.jpg" height="100" width="100">
                    消息
                </mt-tab-item>
                <mt-tab-item id="联系人">
                    <img slot="icon" src="../../../static/img/link.jpg" height="100" width="100">
                    联系人
                </mt-tab-item>
            </mt-tabbar>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
    data(){
        return {
            timeOutEvent: 0,//定时器
            userId:'',
            baseSelected:'联系人',
            selected:'好友',
            imgUrl:'',
            friendDatas:[],
            newsDatas:[],
            webSocket:{},
            remindDatas:[],  //点对点聊天提示消息
            remindDatasg:[],  //群聊聊天提示消息
            groupChat:[]
        }
    },

    created(){
        this.userId = this.$store.getters.loginResult.object.id;

        //获取状态管理器中存到的提示消息
        this.remindDatas = this.$store.getters.remindDatas;
        this.remindDatasg = this.$store.getters.remindDatasg;
        // this.userId = 1;
        Indicator.open({
            spinnerType: 'snake'
        });
        this.$store.dispatch('getUserInfo',this.userId).then(res => {
            Indicator.close();
            // console.log(res);
            var datas = res.data.data.friendDatas;
            for(var i=0;i<datas.length;i++){
                for(var j=0;j<datas[i].friends.length;j++){
                    if(datas[i].friends[j].sign.length>15){
                        var newSgin=datas[i].friends[j].sign.substring(0,15)+"...";
                        datas[i].friends[j].sign=newSgin;
                    }
                }
            }
            this.friendDatas = datas;
            this.imgUrl = res.data.data.mine.avatar;
            this.groupChat = res.data.data.groupChat;
            console.log(this.groupChat);
            if(res.data.data.friendDatas.length==0){
                console.log("该用户暂无好友");
            }else{
                this.newsDatas = res.data.data.friendDatas[0].friends;
            }
        });

        //获取登录时的websocket
        this.webSocket = this.$store.getters.webSocket;

        //由于需要实时同步在线状态，所以初始化消息接收监听
        this.webSocket.onmessage = this.websocketonmessage;
        // this.initWebSocket();
    },
    methods: {
        
        userInfo(){
            this.$router.push({ path: '/mineInfo' })
        },
        oneChat(v){
            console.log("点对点聊天"+v);
            this.$router.push({
                name:'one',
                params:{
                    mineId:this.userId, //当前登录用户的ID
                    friendName:v  //点击的好友名字
                }
            });
        },
        Chats(id,name,mine){
            // console.log("广播聊天"+id+" "+name);
            this.$router.push({ 
                name: 'broadcast',
                params:{
                    groupChatId:id,
                    groupChatName:name,
                    mine:mine
                }
            })
        },
        websocketonmessage(message){
            const redata = JSON.parse(message.data);
            if(redata.type==="changeOnlineStatus"){
                const dataDeal = this.friendDatas;
                //实时接收好友中的状态信息（上下线）
                for(var i=0;i<dataDeal.length;i++){
                    for(var n=0;n<dataDeal[i].friends.length;n++){
                        if(dataDeal[i].friends[n].id==redata.userId){
                            this.friendDatas[i].friends[n].status=redata.status;
                        }
                    }
                }
            }else if(redata.type==="updateInfo"){
                const dataDeal = this.friendDatas;
                //实时接收好友中的状态信息（上下线）
                for(var i=0;i<dataDeal.length;i++){
                    for(var n=0;n<dataDeal[i].friends.length;n++){
                        if(dataDeal[i].friends[n].id==redata.userId){
                            this.friendDatas[i].friends[n].username=redata.mineName;
                            if(redata.sign.length>15){
                                this.friendDatas[i].friends[n].sign=redata.sign.substring(0,15)+"..."
                            }else{
                                this.friendDatas[i].friends[n].sign=redata.sign;
                            }
                        }
                    }
                }
            }else if(redata.type==="forceOffline"){
                this.webSocket.close();
                this.$router.push({ path: '/' })
                MessageBox('警告', redata.message);
            }else if(redata.type==="friend"){

                //进行消息处理，将发来的消息长度大于16的字符串进行处理，最后生成新的消息newDatas
                var newDatas = redata;
                if(redata.message.length>16){
                    newDatas.message=redata.message.substring(0,16)+'...';
                }else{
                    newDatas.message=redata.message;
                }

                if(this.remindDatas.length==0){
                    // console.log("消息界面无数据");
                    this.remindDatas.push(newDatas);
                }else{
                    // console.log("消息界面有数据");
                    var flag = false;
                    for(var i=0;i<this.remindDatas.length;i++){
                        if(this.remindDatas[i].mine.mineId==newDatas.mine.mineId){
                            this.remindDatas[i].message=newDatas.message;
                            flag = true;   //此人已经发来消息。
                            // console.log("此人已经发来消息");
                        }
                    }
                    if(!flag){
                        // console.log("此人第一次发来消息");
                        this.remindDatas.push(newDatas);
                    }
                }
                //将这个提示的消息存放到状态管理器中，以便再次返回的时候进行读取
                this.$store.dispatch('saveRemindDatas',this.remindDatas);

            }else if(redata.type==="groupChat"){
                var newDatas = redata;
                if(redata.message.length>16){
                    newDatas.message=redata.message.substring(0,16)+'...';
                }else{
                    newDatas.message=redata.message;
                }

                if(this.remindDatasg.length==0){
                    console.log("消息界面无群聊数据");
                    this.remindDatasg.push(newDatas);
                }else{
                    // console.log("消息界面有群聊数据");
                    var flag = false;
                    for(var i=0;i<this.remindDatasg.length;i++){
                        if(this.remindDatasg[i].groupChat.groupChatId==newDatas.groupChat.groupChatId){
                            this.remindDatasg[i].mine.mineName=newDatas.mine.mineName
                            this.remindDatasg[i].message=newDatas.message;
                            flag = true;   //此群已经有人已经发来消息。
                            console.log("此群已经有人已经发来消息");
                        }
                    }
                    if(!flag){
                        console.log("此群第一次发来消息");
                        this.remindDatasg.push(newDatas);
                    }
                }
                //将这个提示的消息存放到状态管理器中，以便再次返回的时候进行读取
                this.$store.dispatch('saveRemindDatasg',this.remindDatasg);
            }else if(redata.type==="warn"){
                MessageBox('警告', redata.message);
            }else if(redata.type==="ann"){
                MessageBox('公告', redata.message);
            }
            console.log("收到数据："+message.data);
        },
        handleChange(val) {
            console.log(val);
        },
        showUserInfo(v){
            this.$router.push({
                name:'friendInfo',
                params:{
                    friendName:v
                }
            })
        },
        logout(){
            this.webSocket.close();
            this.$router.push({ path: '/' })
        },
        style(v){
            return v.status=="online"
        },
        skipManagerFriendGroup(value){
            this.$router.push({ 
                name: 'managerFriendGroup',
                params:{
                    friendGroupId:this.value,
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
    .mint-header{
        height: 70px
    }
    .mint-header.is-fixed {
        top: 0;
        right: 0;
        left: 0;
        /* position: fixed; */
        // z-index: 1;
        height: 70px;
    }
    .mint-header-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        font-weight: 400;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }
    .option{
        top: 71px;
        margin: 0;
        width: 100%
    }
    .mint-tab-item-label {
        color: inherit;
        font-size: 17px;
        line-height: 1;
    }
    .friendData{
        overflow: auto;
        height: 378px;
    }
    .nameStyle{
        font-family: serif;
        font-size: 14px;
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
    .statusStyle{
        color: green
    }
    .homeAll{
        height: 100%;
    }
    
    .newsTab{
        width: 100%;
        height: 530px;
        // top: 30px;
        overflow: auto;
    }

    .baseTab{
        width: 100%;
    }

    .newsMineHeader{
        background-color: rgb(1, 200, 250);
        width: 100%;
        height: 65px;
    }
     .newsMineAvatar{
        position: fixed; 
        width: 55px;
        height: 55px;
        top: 12px;
        left: 12px;
    }
    .newsHeaderTitle{
        position: fixed;
        top: 28px;
        left: 46%;
        color: rgb(255, 255, 255);
        font-size: 18px;
    }
    .newsHeaderButton{
        position: fixed;
        top: 30px;
        right: 5%;
        color: rgb(255, 255, 255);
        font-size: 16px;
    }

    .newsNameStyle{
        font-family: serif;
        font-size: 14px;
    }
    .newsStyle{
        width: 100%;
        float: left;
    }
    .newsAvatarStyle{
        width: 49px;
        float: left;
    }
    .newsInfoStyle{
        float: left;
    }
    .newsStatusStyle{
        color: rgb(151, 151, 151)
    }


    .newsStyleg{
        width: 100%;
        float: left;
    }
    .newsAvatarStyleg{
        width: 49px;
        float: left;
    }
    .newsInfoStyleg{
        float: left;
    }
    .newsStatusStyleg{
        color: rgb(151, 151, 151)
    }
</style>
