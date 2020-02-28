<template>
<div class="cropper-component">
    <div>
      <mt-header title="更改头像">
        <div slot="left" @click="backTo">
            <mt-button icon="back">返回</mt-button>
        </div>
      </mt-header>
    </div>
    <div class="info-item">
        <div class="btn-box">
          <label class="btn" for="uploads">选择图片</label>
          <input type="file" id="uploads" :value="imgFile" 
            style="position:absolute; clip:rect(0 0 0 0);width: 1px;" 
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event, 1)">
        </div>
        <div class="operation-box">
            <div class="cropper">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="option.info"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                ></vueCropper>
            </div>
        </div>
        <div class="preview-box">
            <div>预览：</div>
            <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img">
            </div>
        </div>
        <div class="btn-box">
            <input type="button" class="operation-btn" value="↺" title="左旋转" @click="rotateLeft">
            <input type="button" class="operation-btn" value="↻" title="右旋转" @click="rotateRight">
            <div class="btn" @click="finish('blob')">上传头像</div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import host from '@/utils/request_conf.js'
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
    name: 'cropper',
    data() {
        return {
            //当前登录用户的id
            mineId:'',
            //剪切图片上传
            crap: false,
            previews: {},
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 1, // 剪切后的图片质量（0.1-1）
                full: true, // 输出原图比例截图 props名full
                outputType: 'png', // 裁剪生成的图片的格式
                canMove: true,  // 能否拖动图片
                original: false,  // 上传图片是否显示原始宽高
                canMoveBox: true,  // 能否拖动截图框
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 150, 
                autoCropHeight: 150, 
                fixedBox: true // 截图框固定大小
            }, 
            fileName:'',  // 本机文件地址
            // downImg: '#',
            imgFile:'',
            // uploadImgRelaPath:'', // 上传后的图片的地址（不带服务器域名）
        }
    },
    props: ["uploadType"],
    created(){
       //获取登录时的websocket
      this.webSocket = this.$store.getters.webSocket;

      //由于需要实时监听是否被挤掉，所以初始化消息接收监听
      this.webSocket.onmessage = this.websocketonmessage;
      // this.initWebSocket();
    },
    methods: { 
      // 放大/缩小
      changeScale(num) { 
        num = num || 1; 
        this.$refs.cropper.changeScale(num); 
      }, 
      // 坐旋转
      rotateLeft() { 
        this.$refs.cropper.rotateLeft(); 
      }, 
      // 右旋转
      rotateRight() { 
        this.$refs.cropper.rotateRight(); 
      }, 
      // 上传图片（点击上传按钮）
      finish(type) { 
        console.log('finish', type)
        let _this = this;
        let formData = new FormData();
        // 输出 
        if (type === 'blob') { 
          this.$refs.cropper.getCropBlob((data) => { 
            let img = window.URL.createObjectURL(data) 
            console.log(data);
            console.log(img);
            if(data.size>=1048576){
                MessageBox('提示', "图片过大，请重新选择");
            }else{
                Indicator.open({
                    spinnerType: 'snake'
                });
                this.mineId=this.$store.getters.loginResult.object.id;
                formData.append('img', data, _this.fileName)
                formData.append('mineId',this.mineId);
                // formData.append('operaType', this.uploadType)
                console.log(data+"      " + _this.fileName+"      "+this.uploadType);
                axios.post(host.HOST_NAME+"/user/avatarUpload",formData).then(res => {
                  Indicator.close();
                  console.log(res);
                    if(res.data.code===0){
                      // this.$message({
                      //   message:res.data.msg,
                      //   type:"success"
                      // })
                      MessageBox('成功', res.data.msg);
                      this.$router.push({ path: '/home' })
                    }else if(res.data.code===1){
                      // this.$message({
                      //   message:res.data.msg,
                      //   type:"error"
                      // })
                      MessageBox('错误', res.data.msg);
                    }
                  }).catch(err => {
                    Indicator.close();
                    if (err.data) {
                        // this.$message.error(err.data.msg)
                        MessageBox('错误', err.data.msg);
                    } else {
                        // this.$message.error('上传失败，服务器发生错误，请稍后再试！')
                        MessageBox('错误', '上传失败，服务器发生错误，请稍后再试！');
                    }
                });
            }
          }) 
        } else { 
          this.$refs.cropper.getCropData((data) => { 
            // this.model = true; 
            // this.modelSrc = data; 
          }) 
        } 
      }, 
      // 实时预览函数 
      realTime(data) { 
        console.log('realTime')
        this.previews = data 
      }, 
      // 选择本地图片
      uploadImg(e, num) { 
        console.log('uploadImg');
        var _this = this;
        // 上传图片 
        var file = e.target.files[0] 
        _this.fileName = file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) { 
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种') 
          return false 
        } 
        var reader = new FileReader(); 
        reader.onload =(e) => { 
          let data; 
          if (typeof e.target.result === 'object') { 
            // 把Array Buffer转化为blob 如果是base64不需要 
            data = window.URL.createObjectURL(new Blob([e.target.result])) 
          } 
          else { 
            data = e.target.result 
          }
          if (num === 1) { 
            _this.option.img = data 
          } else if (num === 2) { 
            _this.example2.img = data 
          } 
        } 
        // 转化为base64 
        // reader.readAsDataURL(file) 
        // 转化为blob 
        reader.readAsArrayBuffer(file);
      }, 
      imgLoad (msg) { 
        console.log('imgLoad')
        console.log(msg) 
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
.cropper-component {
    .btn-box {
        margin: 20px 0;
        .btn {
            padding: 8px 20px;
            text-align: center;
            border-radius: 4px;
            background-color: #387EF6;
            color: #fff;
            cursor: pointer;
            display: inline-block;
        }
        .operation-btn {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: #fff;
            border: 1px solid #eaeaea;
            cursor: pointer;
            display: inline-block;
            font-size: 20px;
            color: #333;
            padding: 0;
            margin: 0 10px;
        }
    }
    .info-item {
        .operation-box {
            display: inline-block;
            .cropper {
                width: 260px;
                height: 260px;
            }	
        }
        .preview-box {
            top: 60px;
            right: 10px;
            .preview {
                width: 150px;
                height: 150px;
                border-radius: 17px;
                border: 1px solid #ccc;
                background-color: #ccc;
                margin: 5px;
                overflow: hidden;
            }
        }
    }
}
</style>



