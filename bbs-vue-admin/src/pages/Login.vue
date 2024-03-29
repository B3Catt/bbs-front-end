<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="userPassword">
          <el-input
            v-model="loginForm.userPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from "@/utils/auth"

export default {
  data() {
    return {
      // 这是登陆表单的数据表单对象
      loginForm: {
        userName: "",
        userPassword: "",
      },
      // 这是表单的映射规则对象
      loginFormRules: {
        // 验证用户名是否合法
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        // 验证密码是否合法
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 20,
            message: "长度在 4 到 16 个字符之间",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post("login", this.loginForm)
        // 判断是否成功
        if (res.code !== 200) {
          return this.$message.error({
            message: res.msg,
            center: true,
          })
        }
        this.$message.success({
          message: res.msg,
          center: true,
        })
        // 1. 将登陆之后的 token 保存到客户端的 sessionStorage 中
        //  1.1 项目中出了登录之外的其他 API 接口，必须在登录之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以将 token 保存到 sessionStorage 中
        setToken(res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home")
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -moz-box-shadow:2px 2px 10px rgb(0, 16, 33);
  -webkit-box-shadow:2px 2px 10px rgb(0, 16, 33);
  box-shadow:2px 2px 10px rgb(0, 16, 33);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 2%;
    width: 100%;
    padding: 0 25px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>