<template xmlns="">
  <div>
    <!-- 搜索区域 -->
    <el-row>
      <el-col :span="7">
        <el-input
          placeholder="请输入专栏标题"
          v-model="queryInfo.columnTitle"
          clearable
          @clear="getCollectionList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getCollectionList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 专栏列表区域 -->
    <el-table :data="columnList" style="width: 100%" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="boardName" label="板块" width="180">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="getColumns(scope.row.boardId)">
            {{ scope.row.boardName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="发布者" width="180">
      </el-table-column>
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="columnDetail(scope.row.id)">
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="65">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-close"
            size="mini"
            @click="cancel(scope.row.id)"
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
      // 获取用户列表的参数对象
      queryInfo: {
        pageNum: 1,
        pageSize: 2,
        columnTitle: "",
      },
      columnList: [],
      total: 0,
    }
  },
  created() {
    this.getCollectionList()
  },
  methods: {
    getCollectionList() {
      request
        .get("collection/columnList", {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.code !== 200) return this.$message.error(res.msg)
          this.columnList = res.data.rows
          // 将源数据中的字符串转为布尔值
          this.columnList.map((column) => (column.isTop = !!+column.isTop))
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
    cancel(id) {
      let params = qs.stringify({
        columnId: id,
      })
      request.post("collection/cancel", params).then((res) => {
        if (res.code !== 200) {
          return this.$message.error({
            message: res.msg,
            center: true,
          })
        }
        this.$message.success({
          message: "取消收藏成功！",
          center: true,
        })
        this.getColumnList()
      })
    },
    // 跳转到对应板块
    getColumns(boardId) {
      this.$router.push({
        path: "/columns",
        query: {
          boardId: boardId,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>