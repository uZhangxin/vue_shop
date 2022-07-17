<template>
  <div class="z-login-container">
    <div class="z-login-box">
      <el-form ref="loginForm" class="z-login-form" :model="loginForm" :rules="rules" label-width="0px">
        <!--用户名-->
        <el-form-item class="z-login-form-input" prop="userName">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="loginForm.userName"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item class="z-login-form-input">
          <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="z-login-button">
          <el-button type="primary" @click="loginBtn">登录</el-button>
          <el-button type="info">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>


export default {
  name: "Login",
  data() {
    return {
      //登录表单
      loginForm: {
        //用户名
        userName: "admin",
        //密码
        password: "123456"
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 8 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    loginBtn() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return
        }
        let data = {
          username: this.loginForm.userName,
          password: this.loginForm.password
        }
        this.$http({method: 'POST', data: data, url: '/login'}).then(res => {
          //登录成功
          if (res.data.meta.status === 200) {
            //保存token
            window.sessionStorage.setItem('token', res.data.data.token)
            console.log(res.data.meta.token);
            //登录成功跳转主页面
            this.$router.push("/home")
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            //用户名密码不匹配
          } else if (res.data.meta.status === 400) {
            this.$message.error("用户名与密码不匹配")
            //密码置空
            this.loginForm.password = ""
          }
        })

      })
    }
  }


}
</script>

<style lang="less" scoped>
.z-login-container {
  height: 100%;
  background: url("../assets/images/login_bg.jpg") no-repeat;
  background-size: cover
}

.z-login-box {
  width: 370px;
  height: 360px;
  background-color: #fafafa;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 5px 5px 5px #071D32;
  opacity: 0.8
}

.z-login-form {
  position: absolute;
  width: 100%;
  padding: 0 38px;
  box-sizing: border-box;
  top: 100px;

  .z-login-form-input {
    margin-bottom: 30px;
  }
}

.z-login-button {
  display: flex;
  justify-content: center;
  margin: 40px 0 0 0;
}
</style>