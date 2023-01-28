<template>
  <div class="header">
    <div style="flex: 1; align-items: center">
      <span
        :class="collapseBtnClass"
        style="cursor: pointer"
        @click="toggleCollapse"
      ></span>
      <!-- 面包屑导航区 -->
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        v-if="$route.meta.breadcrumbShow"
      >
        <el-breadcrumb-item
          v-for="item in $route.meta.toBreadcrumbItems"
          :key="item.path"
          :to="{ path: item.path }"
          >{{ item.name }}</el-breadcrumb-item
        >
        <el-breadcrumb-item
          v-for="item in $route.meta.constBreadcrumbItems"
          :key="item"
          >{{ item }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <!-- 登录后显示个人用户名 -->
    <el-dropdown style="cursor: pointer" v-show="isLogin">
      <span>{{ userName }}</span>
      <i class="el-icon-arrow-down" style="margin-left: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="userInfo">个人信息</el-dropdown-item>
        <el-dropdown-item @click.native="changePassword"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 未登录状态下显示请登录 -->
    <el-dropdown style="cursor: pointer" v-show="!isLogin">
      <span>请登录</span>
      <i class="el-icon-arrow-down" style="margin-left: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="login">登录</el-dropdown-item>
        <el-dropdown-item @click.native="register">注册</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ["collapseBtnClass", "userName", "isLogin"],
  created() {},
  methods: {
    // 监听侧边栏的打开关闭
    toggleCollapse() {
      this.$emit("toggleCollapse")
    },
    // 监听打开登录对话框
    login() {
      this.$emit("login")
    },
    logout() {
      this.$emit("logout")
    },
    register() {
      this.$emit("register")
    },
    userInfo() {
      this.$router.push("/userInfo")
    },
    changePassword() {
      this.$emit("changePassword")
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 5px;
  font-size: 20px;
}
</style>