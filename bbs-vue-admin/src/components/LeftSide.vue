<template>
  <!-- 侧边栏菜单区域 -->
  <el-aside :width="isCollapsed ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
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
      <!-- 1级菜单 -->
      <el-submenu index="1">
        <!-- 1级菜单的模板区 -->
        <template slot="title">
          <!-- 图表 -->
          <i class="el-icon-s-custom"></i>
          <!-- 文本 -->
          <span>用户管理</span>
        </template>

        <!-- 二级菜单项 -->
        <el-menu-item index="/users">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>用户列表</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <!-- 1级菜单 -->
      <el-submenu index="2">
        <!-- 1级菜单的模板区 -->
        <template slot="title">
          <!-- 图表 -->
          <i class="el-icon-s-check"></i>
          <!-- 文本 -->
          <span>审核管理</span>
        </template>

        <!-- 二级菜单项 -->
        <el-menu-item index="/columns">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>专栏列表</span>
          </template>
        </el-menu-item>

        <el-menu-item index="/floors">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>楼层列表</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <!-- 1级菜单 -->
      <el-submenu index="3">
        <!-- 1级菜单的模板区 -->
        <template slot="title">
          <!-- 图表 -->
          <i class="el-icon-s-grid"></i>
          <!-- 文本 -->
          <span>板块管理</span>
        </template>

        <!-- 二级菜单项 -->
        <el-menu-item index="/boards">
          <template slot="title">
            <!-- 图表 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>板块列表</span>
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
      isCollapsed: false,
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
}
</script>


<style lang="less" scoped>
.el-aside {
  background-color: #fff0cd;

  .el-menu {
    border-right : 0px;
  }
}

.toggle-button {
  background-color: #f4e4c1;
  font-size: 10px;
  line-height: 24px;
  color: #591804;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>