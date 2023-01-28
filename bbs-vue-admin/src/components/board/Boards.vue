<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>板块管理</el-breadcrumb-item>
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
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加板块</el-button
          >
        </el-col>
      </el-row>
      <!-- 板块列表区域 -->
      <el-table :data="boardList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="boardName" label="板块名"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该板块吗？"
              @confirm="deleteBoard(scope.row.id)"
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
    <!-- 添加板块的对话框 -->
    <el-dialog
      title="添加板块"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose()"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="板块名称" prop="boardName">
          <el-input v-model="addForm.boardName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBoard()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改板块名的对话框 -->
    <el-dialog
      title="修改板块"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose()"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="板块名称" prop="boardName">
          <el-input v-model="editForm.boardName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBoard()">确 定</el-button>
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
        boardName: "",
      },
      boardList: [],
      total: 0,
      path: "",
      // 控制添加板块对话框的显示与隐藏
      addDialogVisible: false,
      // 添加板块的表单数据
      addForm: {
        boardName: "",
      },
      // 添加板块的规则对象
      addFormRules: {
        boardName: [
          { required: true, message: "请输入板块名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 控制修改板块对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {
        id: 0,
        boardName: "",
      },
      editFormRules: {
        boardName: [
          { required: true, message: "请输入板块名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符之间",
            trigger: "blur",
          },
        ],
      },
    }
  },
  created() {
    this.getBoardList()
  },
  methods: {
    async getBoardList() {
      const { data: res } = await this.$http.get("board", {
        params: this.queryInfo,
      })
      if (res.code !== 200) return this.$message.error(res.msg)
      this.boardList = res.data.rows
      this.total = res.data.total
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
    // 监听对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加板块
    addBoard() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post("board/add", this.addForm)
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
        // 隐藏添加板块的对话框
        this.addDialogVisible = false
        // 重新获取数据
        this.getBoardList()
      })
    },
    // 展示编辑板块对话框
    showEditDialog(board) {
      this.editDialogVisible = true
      this.editForm = board
    },
    editBoard() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `board/${this.editForm.id}`,
          this.editForm
        )
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
        // 隐藏添加板块的对话框
        this.editDialogVisible = false
        // 重新获取数据
        this.getBoardList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 删除板块
    async deleteBoard(id) {
      const { data: res } = await this.$http.delete(`board/${id}`)
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
      this.getBoardList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>