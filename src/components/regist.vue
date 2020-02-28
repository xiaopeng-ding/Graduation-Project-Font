<template>
  <div>
      <h1>注册账号</h1>
    <el-form :rules="rules" class="login-container" label-position="left" label-width="0px" ref="registForm" :model="registForm">
      <el-form-item prop="username">
        <el-input type="text" v-model="registForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="registForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="confPassword">
        <el-input type="password" v-model="registForm.confPassword" auto-complete="off" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 47%" @click="regist('registForm')">注册</el-button>
        <el-button type="primary" style="width: 48%" @click="backTo('registForm')">返回</el-button>
      </el-form-item>
    </el-form>
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
          if (this.registForm.confPassword !== '') {
            this.$refs.registForm.validateField('confPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registForm: {
          username:'',
          password:'',
          confPassword:''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            { validator: validatePass, trigger: 'blur' }
          ],
          confPassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
      }
    },
    methods:{
        regist(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    Indicator.open({
                        spinnerType: 'snake'
                    });
                    this.$store.dispatch('regist',this.registForm).then(res => {
                      Indicator.close();
                        if(res.data.code===0){
                            MessageBox('成功', res.data.msg);
                            this.$router.push({ path: '/' })
                        }else if(res.data.code===1){
                            MessageBox('错误', res.data.msg);
                        }
                    });
                } else {
                    MessageBox('错误', "有必填项未填或错误");
                    return false;
                }
            });
        },
        backTo(){
            this.$router.push({ path: '/' })
        }
    }
   }
</script>

<style lang="less" scoped>
  .login-container {
    margin: 20px auto;
    padding: 0 35px 15px 35px;
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