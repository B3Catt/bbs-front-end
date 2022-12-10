<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" height="50px" width="50px" alt="" />
        <span>论坛后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <left-side></left-side>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/auth"
import leftSide from "../components/LeftSide.vue"

export default {
  components: {
    leftSide,
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    async logout() {
      const { data: res } = await this.$http.post("logout")
      if (res.code === 200) {
        this.$message.success({
          message: res.msg,
          center: true,
        })
      }
      removeToken()
      this.$router.push("/login")
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #fff0cd;
  box-shadow: 0 0 7px #aaa;
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #591804;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    margin-left: 5px;
    span {
      margin-left: 15px;
    }
  }
}
.el-main {
  background-color: #fff6df;
}
</style>