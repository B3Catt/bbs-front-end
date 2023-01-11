<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <Aside :isCollapsed="isCollapsed" :isLogin="isLogin" />
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 头部区 -->
      <el-header>
        <Header
          :collapseBtnClass="collapseBtnClass"
          :isLogin="isLogin"
          :userName="userInfo.nickName"
          @toggleCollapse="toggleCollapse"
          @login="loginDialogVisible = true"
          @logout="logout"
          @register="registerDialogVisible = true"
          @changePassword="changePasswordDialogVisible = true"
        />
      </el-header>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view @changeUserInfo="refreshUserInfo" />
      </el-main>
    </el-container>

    <!-- 进行登录的对话框 -->
    <el-dialog
      title="登录"
      :visible.sync="loginDialogVisible"
      width="30%"
      @close="loginDialogClose()"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="loginForm.userPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="login()">确 定</el-button>
        <el-button
          type="success"
          @click="
            registerDialogVisible = true
            loginDialogVisible = false
          "
          >注 册</el-button
        >
      </span>
    </el-dialog>
    <!-- 进行注册的对话框 -->
    <el-dialog
      title="注册"
      :visible.sync="registerDialogVisible"
      width="30%"
      @close="registerDialogClose()"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="registerForm"
        :rules="registerFormRules"
        ref="registerFormRef"
        label-width="0"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="registerForm.userName"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="registerForm.userPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="judge">
          <el-input
            v-model="registerForm.judge"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userEmail">
          <el-input
            v-model="registerForm.userEmail"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="registerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="register()">确 定</el-button>
        <el-button
          type="success"
          @click="
            loginDialogVisible = true
            registerDialogVisible = false
          "
          >登 录</el-button
        >
      </span>
    </el-dialog>
    <!-- 进行修改密码的对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      width="30%"
      @close="changePasswordDialogClose()"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="changePasswordForm"
        :rules="changePasswordFormRules"
        ref="changePasswordFormRef"
        label-width="0"
      >
        <el-form-item prop="oldPassword">
          <el-input
            v-model="changePasswordForm.oldPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="原密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="changePasswordForm.newPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="judge">
          <el-input
            v-model="changePasswordForm.judge"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="changePassword()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import request from "@/utils/request"
import { removeToken, getToken, setToken } from "@/utils/auth"
import Aside from "../components/Aside.vue"
import Header from "../components/Header.vue"
import qs from "qs"

export default {
  components: {
    Aside,
    Header,
  },
  data() {
    // 这是定义的校验规则
    //   验证邮箱格式是否正确
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      // 非法邮箱
      return callback(new Error("请输入正确的邮箱"))
    }
    //   验证再次输入密码是否正确
    var checkJudge = (rule, value, callback) => {
      if (value !== this.registerForm.userPassword) {
        // 两次密码不一样
        return callback(new Error("两次输入密码不一致！"))
      }
      return callback()
    }
    //   验证修改密码的再次输入的新密码是否正确
    var checkJudge2 = (rule, value, callback) => {
      if (value !== this.changePasswordForm.newPassword) {
        // 两次密码不一样
        return callback(new Error("两次输入密码不一致！"))
      }
      return callback()
    }
    return {
      isCollapsed: false,
      collapseBtnClass: "el-icon-s-fold",
      // 是否登录
      isLogin: false,
      // 用户信息
      userInfo: {},
      // 是否显示登录对话框
      loginDialogVisible: false,
      // 这是登陆表单的数据表单对象
      loginForm: {
        userName: "",
        userPassword: "",
      },
      // 这是登录表单的映射规则对象
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
            max: 16,
            message: "长度在 4 到 16 个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 是否显示注册对话框
      registerDialogVisible: false,
      // 这是注册表单的数据表单对象
      registerForm: {
        userName: "",
        userPassword: "",
        // 再次输入密码校验
        judge: "",
        userEmail: "",
      },
      // 这是注册表单的映射规则对象
      registerFormRules: {
        // 验证用户名是否合法
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符之间",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符之间",
            trigger: "blur",
          },
        ],
        // 在次输入密码是否一致
        judge: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: checkJudge, trigger: "blur" },
        ],
        // 验证用户邮箱是否合法
        userEmail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 是否显示修改密码对话框
      changePasswordDialogVisible: false,
      // 这是修改密码表单的数据表单对象
      changePasswordForm: {
        oldPassword: "",
        newPassword: "",
        judge: "",
      },
      // 这是修改密码表单的映射规则对象
      changePasswordFormRules: {
        // 验证旧密码是否正确
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符之间",
            trigger: "blur",
          },
        ],
        // 验证新密码是否合法
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符之间",
            trigger: "blur",
          },
        ],
        // 在次输入密码是否一致
        judge: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: checkJudge2, trigger: "blur" },
        ],
      },
    }
  },
  created() {
    if (getToken()) {
      this.refreshUserInfo()
    } else {
      this.isLogin = false
    }
  },
  methods: {
    // 监听侧边栏的打开关闭
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      if (this.isCollapsed) {
        this.collapseBtnClass = "el-icon-s-unfold"
      } else {
        this.collapseBtnClass = "el-icon-s-fold"
      }
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return
        request.post("login", this.loginForm).then((res) => {
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
          // 1. 将登陆之后的 token 保存到客户端的 Cookie 中
          //  1.1 项目中出了登录之外的其他 API 接口，必须在登录之后才能访问
          //  1.2 token 只应在当前网站打开期间生效，所以将 token 保存到 sessionStorage 中
          setToken(res.data.token)
          // 将返回的用户信息存储到 user 中

          // 存储用户信息
          this.userInfo = res.data.userInfo
          localStorage.setItem("userInfo", JSON.stringify(this.userInfo))
          this.loginDialogVisible = false
          this.isLogin = true
        })
      })
    },
    // 监听登录对话框的关闭
    loginDialogClose() {
      this.$refs.loginFormRef.resetFields()
    },
    // 退出登录
    logout() {
      request.post("logout").then((res) => {
        if (res.code === 200) {
          this.$message.success({
            message: res.msg,
            center: true,
          })
        }
        // remove the token whatever
        removeToken()
        localStorage.removeItem("userInfo")
        this.isLogin = false
      })
    },
    // 注册
    register() {
      this.$refs.registerFormRef.validate((valid) => {
        if (!valid) return
        request.post("user/register", this.registerForm).then((res) => {
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
          // 成功之后跳转登录页面
          this.loginDialogVisible = true
          this.registerDialogVisible = false
        })
      })
    },
    // 监听注册对话框的关闭
    registerDialogClose() {
      this.$refs.registerFormRef.resetFields()
    },
    // 修改密码
    changePassword() {
      this.$refs.changePasswordFormRef.validate((valid) => {
        if (!valid) return
        let params = qs.stringify({
          oldPassword: this.changePasswordForm.oldPassword,
          newPassword: this.changePasswordForm.newPassword,
        })
        request.post("user/password", params).then((res) => {
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
          this.changePasswordDialogVisible = false
          // 重新登陆
          removeToken()
          localStorage.removeItem("userInfo")
          this.isLogin = false
          this.loginDialogVisible = true
        })
      })
    },
    // 监听修改密码表单的关闭
    changePasswordDialogClose() {
      this.$refs.changePasswordFormRef.resetFields()
    },
    // 更新用户信息
    refreshUserInfo() {
      this.isLogin = true
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-main {
  background-color: #fff6df;
}

.el-header {
  background-color: #fff0cd;
  border: 1px solid #fff;
  color: #591804;
}
</style>