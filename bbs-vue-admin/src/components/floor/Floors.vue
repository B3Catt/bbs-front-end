<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>审核管理</el-breadcrumb-item>
      <el-breadcrumb-item>楼层列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 楼层列表区域 -->
      <el-table :data="floorList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="userName" label="发布者" width="180">
        </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该楼层吗？"
              @comfirm="deleteFloor(scope.row.id)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>  
            <!-- 审核通过按钮 -->
            <el-tooltip
              effect="dark"
              content="审核通过"
              placement="top"
              :enterable="false"
            >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="我再想想"
                icon="el-icon-info"
                icon-color="red"
                title="确定审核通过吗？"
                @comfirm="auditFloor(scope.row.id)"
                class="ml-10"
              >
                <el-button
                  type="success"
                  icon="el-icon-success"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
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
      },
      floorList: [],
      total: 0,
      path: "",
    }
  },
  created() {
    this.getFloorList()
  },
  methods: {
    async getFloorList() {
      const { data: res } = await this.$http.get("floor", {
        params: this.queryInfo,
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.floorList = res.data.rows
      this.total = res.data.total
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getFloorList()
    },
    // 监听 pageNum 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getFloorList()
    },
    // 删除楼层
    async deleteFloor(id) {
      const { data: res } = await this.$http.delete(`audit/floor/${id}`)
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
      this.getFloorList()
    },
    // 审核通过
    async auditFloor(id) {
      const { data: res } = await this.$http.put(`audit/floor/${id}`)
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
      this.getFloorList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>