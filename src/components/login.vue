<template>
  <div>
    <div class="logo" >
      <img src="../../static/img/logo.png" style="border-radius: 17px;" height="100" width="100" />
      <p>欢迎使用</p>
    </div>
    <el-form :rules="rules" class="login-container" label-position="left" label-width="0px" ref="loginForm" :model="loginForm">
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button 
          type="primary" 
          style="width: 47%" @click="login('loginForm')">登录</el-button>
        <el-button type="primary" style="width: 48%" @click="regist('loginForm')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
  
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
  export default {
    data() {
      return {
        loginForm: {
          username:'',
          password:''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        checked: true,
      }
    },
    methods:{
      login(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Indicator.open({
              spinnerType: 'snake'
            });
            this.$store.dispatch('login',this.loginForm).then((res) => {
              Indicator.close();
              if(res.data.code===0){
                this.$store.dispatch('setWebSocket',res.data.object.id);
                this.$router.push({ path: '/home' })
              }else if(res.data.code===1){
                MessageBox('错误', res.data.msg);
              }else{
                MessageBox('错误', "未知错误");
              }
            }).catch(() => {
              MessageBox('错误', "服务器异常");
            });
          }else{
            MessageBox('错误', "有必填项未填");
            return false;
          }
        })          
      },
      regist(formName) {
        this.$router.push({ path: '/regist' })
      },
    }
  }
</script>

<style lang="less" scoped>
  .logo{
    margin: 150px auto;
    text-align: center;
    height: 80px;
  }
  .login-container {
    // border-radius: 15px;
    // background-clip: padding-box;
    margin: 20px auto;
    // width: 350px;
    padding: 0 35px 15px 35px;
    // background: #fff;
    // border: 1px solid #eaeaea;
    // box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
 </style>
