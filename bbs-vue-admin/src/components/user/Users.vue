<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="7">
          <el-input
            placeholder="请输入用户昵称"
            v-model="queryInfo.nickName"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="200">
        </el-table-column>
        <el-table-column prop="userName" label="用户名" width="200">
        </el-table-column>
        <el-table-column prop="userEmail" label="邮箱"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- 查看详情按钮 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getUserInfo(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该专栏吗？"
              @comfirm="deleteUser(scope.row.id)"
              class="ml-10"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 查看用户详情对话框 -->
    <el-dialog
      title="专栏详情"
      :visible.sync="detailDialogVisible"
      width="50%"
      @close="addDialogClose()"
    >
      <!-- 内容主体区 -->
      {{ userDetail }}
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        pageNum: 1,
        pageSize: 2,
        nickName: "",
      },
      userList: [],
      total: 0,
      userDetail: {
        nickName: '',
        userSex: '',
        userEmail: '',
        userAge: 0,
        viewCount: 0,
        likeCount: 0,
        collectionCount: 0,
        userSchool: '',
        userMajor: '',
      },
      detailDialogVisible: false,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("user", {
        params: this.queryInfo,
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.userList = res.data.rows
      this.total = res.data.total
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getUserList()
    },
    // 监听 pageNum 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getUserList()
    },
    // 删除用户
    async deleteUser(id) {
      const { data: res } = await this.$http.delete(`user/${id}`)
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
      // 重新获取数据
      this.queryInfo.pageNum = 1
      this.getUserList()
    },
    // 获取用户信息
    async getUserInfo(id) {
      const { data: res } = await this.$http.get(`user/${id}`)
      // 判断是否成功
      if (res.code !== 200) {
        return this.$message.error({
          message: res.msg,
          center: true,
        })
      }
      // 保存数据
      this.userDetail = res.data
      // 打开对话框
      this.detailDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
</style>