<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>板块</el-breadcrumb-item>
      <el-breadcrumb-item>板块列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入板块名字"
            v-model="queryInfo.boardName"
            clearable
            @clear="getBoardList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getBoardList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 板块列表区域 -->
      <el-table :data="boardList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="boardName" label="板块名"> </el-table-column>
        <el-table-column label="操作" width="65">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-link"
              size="mini"
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
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        pageNum: 1,
        pageSize: 2,
        boardName: "",
      },
      boardList: [],
      total: 0,
      path: "",
    }
  },
  created() {
    this.getBoardList()
  },
  methods: {
    getBoardList() {
      request.get("board/getBoardList", {
        params: this.queryInfo,
      }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.boardList = res.data.rows
        this.total = res.data.total
      })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getBoardList()
    },
    // 监听 pageNum 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getBoardList()
    },
  },
}
</script>

<style>

</style>