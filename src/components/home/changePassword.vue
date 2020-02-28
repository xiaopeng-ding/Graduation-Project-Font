<template>
    <div :style="screenSize" >
        <!-- 头部 -->
        <div>
             <mt-header title="修改密码">
                <div slot="left" @click="backTo">
                    <mt-button icon="back">返回</mt-button>
                </div>
            </mt-header>
        </div>
        <div class="blank"></div>
        <div class="passwordForm">
            <el-form :model="myForm" :rules="rules" ref="myForm" label-width="80px" class="demo-myForm">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="myForm.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="myForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="conformPassword">
                    <el-input type="password" v-model="myForm.conformPassword" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-button type="primary" @click="submitForm('myForm')" style="width:100%">修改</el-button>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.myForm.conformPassword !== '') {
            this.$refs.myForm.validateField('conformPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.myForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
            height:'',
            width:'100%',
            webSocket:{},
            myForm: {
                id: '',
                oldPassword: '',
                password: '',
                conformPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                conformPassword: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        };
    },
    created(){
        // this.myForm.id=this.$store.getters.loginResult.user.id;
        this.myForm.id = this.$store.getters.loginResult.object.id;
        this.height = document.documentElement.clientHeight //获取当前屏幕的高度
        //  console.log(this.height)
        this.screenSize = 'width:'+this.width+'; height:'+this.height+'px';

        //获取当前登录的webSocket对象
        this.webSocket = this.$store.getters.webSocket;
        
        this.webSocket.onmessage = this.websocketonmessage;
        // this.initWebSocket();

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Indicator.open({
                spinnerType: 'snake'
            });
            this.$store.dispatch('changePassword',this.myForm).then(res => {
                Indicator.close();
                if(res.data.code===0){
                        // this.$message({
                        //     message:res.data.msg,
                        //     type:"success"
                        // });
                        MessageBox('成功', res.data.msg);
                        this.webSocket.close();
                        this.$router.push({ path: '/' })
                    }else if(res.data.code===1){
                        // this.$message({
                        //     message:res.data.msg,
                        //     type:"warning"
                        // })
                        MessageBox('错误', res.data.msg);
                        }else{
                        // this.$message({
                        //     message:"未知错误",
                        //     type:"warning"
                        // })
                        MessageBox('错误', "未知错误");
                    }
            });
          } else {
            this.$message.error('有必填项未填或出错')
            console.log('error submit!!');
            return false;
          }
        });
      },
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
</style>
