<template>
  <div>
    <!-- 搜索区域 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入专栏标题"
          v-model="queryInfo.columnTitle"
          clearable
          @clear="getColumnList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getColumnList"
          ></el-button>
        </el-input>
      </el-col>
      <!-- 添加按钮 -->
      <el-col :span="4">
        <el-button type="primary" @click="addColumn()">新建专栏</el-button>
      </el-col>
    </el-row>
    <!-- 专栏列表区域 -->
    <el-table :data="columnList" style="width: 100%" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="columnDetail(scope.row.id)">
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="发布者" width="100">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="getUserInfo(scope.row.userId)">
            {{ scope.row.userName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="180"> </el-table-column>
      <el-table-column prop="floorCount" label="楼层数" width="65"> </el-table-column>
      <el-table-column prop="viewCount" label="浏览量" width="65"> </el-table-column>
      <el-table-column label="操作" width="65">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-star-on"
            size="mini"
            @click="collect(scope.row.id)"
          ></el-button>
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
  </div>
</template>

<script>
import request from "@/utils/request"
import qs from "qs"
export default {
  data() {
    return {
      // 获取专栏列表的参数对象
      queryInfo: {
        pageNum: 1,
        pageSize: 2,
        boardId: 0,
        columnTitle: "",
      },
      columnList: [],
      total: 0,
    }
  },
  created() {
    this.queryInfo.boardId = this.$route.query.boardId
    this.getColumnList()
  },
  methods: {
    getColumnList() {
      request
        .get("column/columnList", {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.code !== 200) return this.$message.error(res.msg)
          this.columnList = res.data.rows
          this.total = res.data.total
        })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getColumnList()
    },
    // 监听 pageNum 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getColumnList()
    },
    // 新建专栏
    addColumn() {
      this.$router.push({
        path: "addColumns",
        query: {
          aId: 0,
          boardId: this.queryInfo.boardId,
        },
      })
    },
    // 查看用户信息
    getUserInfo(userId) {
      this.$router.push({
        path: "/getUserInfo",
        query: {
          userId: userId,
        },
      })
    },
    // 查看专栏详情
    columnDetail(columnId) {
      this.$router.push({
        path: "/columnDetail",
        query: {
          columnId: columnId,
        },
      })
    },
    // 收藏或取消收藏
    collect(id) {
      let params = qs.stringify({
        columnId: id,
      })
      request.post("collection/add", params).then((res) => {
        if (res.code !== 200) {
          request.post("collection/cancel", params).then((res) => {
            if (res.code === 200) {
              this.$message.success({
                message: "取消收藏成功！",
                center: true,
              })
            } else {
              this.$message.error({
                message: res.msg,
                center: true,
              })
            }
          })
          return
        }
        this.$message.success({
          message: "收藏成功！",
          center: true,
        })
      })
    },
  },
}
</script>

<style>
</style>