<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <left-side :isCollapsed="isCollapsed" :isLogin="isLogin"></left-side>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 头部区 -->
      <el-header>
        <div style="flex: 1; font-size: 18px">
          <span
            :class="collapseBtnClass"
            style="cursor: pointer"
            @click="toggleCollapse"
          ></span>
        </div>
        <el-dropdown style="cursor: pointer">
          <span>王小虎</span>
          <i class="el-icon-arrow-down" style="margin-left: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken, getToken, setToken } from "@/utils/auth"
import leftSide from "../components/LeftSide.vue"

export default {
  components: {
    leftSide,
  },
  data() {
    return {
      isCollapsed: false,
      collapseBtnClass: "el-icon-s-fold",
      // 是否登录
      isLogin: false,
    }
  },
  created() {
    if (getToken()) {
      this.isLogin = true
    }
  },
  methods: {
    // async logout() {
    //   const { data: res } = await this.$http.post("logout")
    //   if (res.code === 200) {
    //     this.$message.success({
    //       message: res.msg,
    //       center: true,
    //     })
    //   }
    //   removeToken()
    //   this.$router.push("/login")
    // }
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      if (this.isCollapsed) {
        this.collapseBtnClass = "el-icon-s-unfold"
      } else {
        this.collapseBtnClass = "el-icon-s-fold"
      }
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #fff0cd;
  border: 1px solid #fff;
  display: flex;
  // padding-left: 0;
  justify-content: flex-end;
  align-items: center;
  color: #591804;
  font-size: 12px;
  // > div {
  //   display: flex;
  //   align-items: center;
  //   margin-left: 5px;
  //   span {
  //     margin-left: 15px;
  //   }
  // }
}
.el-main {
  background-color: #fff6df;
}
</style>