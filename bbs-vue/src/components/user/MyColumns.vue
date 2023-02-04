<template>
  <div>
    <!-- 搜索区域 -->
    <el-row>
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
    </el-row>
    <!-- 专栏列表区域 -->
    <el-table :data="columnList" style="width: 100%" border stripe>
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="boardName" label="板块" width="180">
      </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="isPublish" label="是否发布" width="100">
        <template slot-scope="scope">
          {{ scope.row.isPublish ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column prop="isComment" label="允许评论" width="100">
        <template slot-scope="scope">
          {{ scope.row.isComment ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column prop="isAudit" label="是否通过审核" width="120">
        <template slot-scope="scope">
          {{ scope.row.isAudit ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="updateColumn(scope.row)"
          ></el-button>
          <el-button type="primary" icon="el-icon-link" size="mini" @click="columnDetail(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="我再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该专栏吗？"
            @confirm="deleteColumn(scope.row)"
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
  </div>
</template>

<script>
import request from "@/utils/request"
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
    this.getColumnList()
  },
  methods: {
    getColumnList() {
      request
        .get("column/myColumnList", {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.code !== 200) return this.$message.error(res.msg)
          this.columnList = res.data.rows
          // 将源数据中的字符串转为布尔值
          this.columnList.map((column) => {
            column.isTop = !!+column.isTop
            column.isComment = !!+column.isComment
            column.isPublish = !!+column.isPublish
            column.isAudit = !!+column.isAudit
          })
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
    // 修改专栏
    updateColumn(column) {
      this.$router.push({
        path: "addColumns",
        query: {
          aId: column.id,
          boardId: column.boardId,
        },
      })
    },
    // 删除专栏
    deleteColumn(column) {
      request.delete(`column/delete/${column.id}`).then((res) => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.columnList = res.data.rows
        // 将源数据中的字符串转为布尔值
        this.columnList.map((column) => {
          column.isTop = !!+column.isTop
          column.isComment = !!+column.isComment
          column.isPublish = !!+column.isPublish
          column.isAudit = !!+column.isAudit
        })
        this.total = res.data.total
      })
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
    }
  },
}
</script>

<style lang="less" scoped>
</style>