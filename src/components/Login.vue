<template>
  <div class="login_container">
    <ul class="bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class="login_box">
      <div class="avator_box">
        <img src="../assets/avator.jpg" alt="" />
      </div>

      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮和重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度应在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度应在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
   
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  },
}
</script>

<style lang="less" scoped>
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avator_box {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.8);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .el-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.login_container {
  background-color: #ff4f4f;
  height: 100%;
  width: 100%;
  position: fixed;
}
body .bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
body .bubbles li {
  position: absolute;
  display: block;
  width: 20px;
  height: 20px;
  bottom: -190px;
  background: rgba(94, 94, 94, 0.2);
  animation: animate infinite linear 15s;
}
body .bubbles li:nth-child(1) {
  left: 50%;
  width: 110px;
  height: 110px;
  animation-delay: 0;
}
body .bubbles li:nth-child(2) {
  left: 50%;
  width: 80px;
  height: 80px;
  animation-delay: 2s;
}
body .bubbles li:nth-child(3) {
  left: 70%;
  width: 60px;
  height: 60px;
  animation-delay: 0;
}
body .bubbles li:nth-child(4) {
  left: 30%;
  width: 170px;
  height: 170px;
  animation-delay: 3s;
}
body .bubbles li:nth-child(5) {
  left: 90%;
  width: 170px;
  height: 170px;
  animation-delay: 5s;
}
body .bubbles li:nth-child(6) {
  left: 10%;
  width: 160px;
  height: 160px;
  animation-delay: 7s;
}
body .bubbles li:nth-child(7) {
  left: 20%;
  width: 90px;
  height: 90px;
  animation-delay: 11s;
}
body .bubbles li:nth-child(8) {
  left: 90%;
  width: 110px;
  height: 110px;
  animation-delay: 10s;
}
body .bubbles li:nth-child(9) {
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 10s;
}
body .bubbles li:nth-child(10) {
  left: 60%;
  width: 140px;
  height: 140px;
  animation-delay: 6s;
}
@keyframes animate {
  0% {
    transform: translateY(0) rotateZ(0deg);
  }
  100% {
    transform: translateY(-900px) rotateZ(1080deg);
    border-radius: 50%;
  }
}
</style>