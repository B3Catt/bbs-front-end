<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专栏管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
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
        <el-table-column prop="userName" label="发布者" width="180">
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="isTop" label="置顶" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isTop"
              @change="update(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- 查看详情按钮 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getColumnInfo(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该专栏吗？"
              @confirm="deleteColumn(scope.row.id)"
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
    <!-- 查看专栏详情对话框 -->
    <el-dialog
      title="专栏详情"
      :visible.sync="detailDialogVisible"
      width="50%"
    >
      <!-- 内容主体区 -->
      <div>
        <header>
          <h2>
            <a>
              {{ columnDetail.title }}
            </a>
          </h2>
          <div>
            发表于 <span>{{ columnDetail.createTime }}</span>  ·  
            用户名 <span>{{ columnDetail.userName }}</span>  ·  
            板块名 <span>{{ columnDetail.userName }}</span>
          </div>
          <div>
          </div>
        </header>
        <div v-html="columnDetail.content" style="margin-top: 40px"></div>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor"
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
      columnDetail: {
        userName: "",
        boardName: "",
        createTime: "",
        title: "",
        content: "",
        floorCount: 0,
        viewCount: 0,
        collectionCount: 0,
      },
      detailDialogVisible: false,
    }
  },
  created() {
    this.getColumnList()
  },
  methods: {
    async getColumnList() {
      const { data: res } = await this.$http.get("column/columnList", {
        params: this.queryInfo,
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.columnList = res.data.rows
      // 将源数据中的字符串转为布尔值
      this.columnList.map((column) => (column.isTop = !!+column.isTop))
      this.total = res.data.total
    },
    // 监听 column 状态的改变
    async update(columnInfo) {
      // 设置节点
      var path = ""
      if (!columnInfo.isTop) {
        path = "/cancel"
      }
      // 得到结果
      const { data: res } = await this.$http.post(
        `column/top${path}/${columnInfo.id}`
      )
      if (res.code !== 200) {
        columnInfo.isTop = !columnInfo.isTop
        return this.$message.error(res.msg)
      }
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
    // 删除专栏
    async deleteColumn(id) {
      const { data: res } = await this.$http.delete(`audit/column/${id}`)
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
      this.getColumnList()
    },
    async getColumnInfo(id) {
      const { data: res } = await this.$http.get(`column/${id}`)
      // 判断是否成功
      if (res.code !== 200) {
        return this.$message.error({
          message: res.msg,
          center: true,
        })
      }
      // 保存数据
      this.columnDetail = res.data

      const markdownIt = mavonEditor.getMarkdownIt()
      // markdownIt.re
      this.columnDetail.content = markdownIt.render(this.columnDetail.content)
      // 打开对话框
      this.detailDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
</style>