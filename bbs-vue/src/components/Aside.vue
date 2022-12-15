<template>
  <!-- 侧边栏菜单区域 -->
  <el-aside :width="isCollapsed ? '64px' : '200px'">
    <!-- 侧边栏头部区域 -->
    <div class="aside-head">
      <img
        src="../assets/logo.png"
        alt=""
        style="width: 30px; margin-right: 15px; margin-left: 15px"
      />
      <b style="color: #591804" v-show="!isCollapsed">校园论坛系统</b>
    </div>
    <el-menu
      background-color="#fff0cd"
      text-color="#591804"
      active-text-color="#B87563"
      unique-opened
      :collapse="isCollapsed"
      :collapse-transition="false"
      :default-active="activePath"
      router
    >
      <!-- 首页 -->
      <el-menu-item index="/home">
        <template>
          <!-- 图表 -->
          <i class="el-icon-s-home"></i>
          <!-- 文本 -->
          <span>首 页</span>
        </template>
      </el-menu-item>
      <!-- 板块 -->
      <el-menu-item index="/boards">
        <template>
          <!-- 图表 -->
          <i class="el-icon-s-grid"></i>
          <!-- 文本 -->
          <span>板 块</span>
        </template>
      </el-menu-item>

      <!-- 1级菜单 -->
      <el-submenu index="2" v-if="isLogin">
        <!-- 1级菜单的模板区 -->
        <template slot="title">
          <!-- 图表 -->
          <i class="el-icon-s-custom"></i>
          <!-- 文本 -->
          <span>个人中心</span>
        </template>

        <!-- 二级菜单项 -->
        <el-menu-item index="/userInfo">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>个人信息</span>
          </template>
        </el-menu-item>

        <el-menu-item index="/myColumns">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>我的专栏</span>
          </template>
        </el-menu-item>

        <el-menu-item index="/myCollections">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>我的收藏</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {
      // 被激活的链接地址
      activePath: "",
    }
  },
  methods: {
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
  },
  created() {
    this.activePath = this.$router.history.current.fullPath
  },
  props: {
    isCollapsed: Boolean,
    isLogin: Boolean,
  },
}
</script>


<style lang="less" scoped>
.el-aside {
  background-color: #fff0cd;
  .el-menu {
    border-right: 0px;
  }
}

.aside-head {
  height: 60px;
  line-height: 60px;
  align-items: center;
  text-align: center;
  display: flex;
}
</style>