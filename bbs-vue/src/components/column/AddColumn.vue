<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="允许评论">
            <el-radio-group v-model="form.isComment">
              <el-radio :key="'0'" :label="'0'">停用</el-radio>
              <el-radio :key="'1'" :label="'1'">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" />
      <el-row>
        <mavon-editor ref="md" v-model="form.content" />
      </el-row>
    </el-form>

    <el-row :gutter="50">
      <el-col :span="22">
        <el-button type="primary" size="medium" @click="handleSubmit">{{
          aId ? "更新" : "发布"
        }}</el-button>
        <el-button v-if="!aId" type="info" @click="handleSave"
          >保存到草稿箱</el-button
        >
      </el-col>
      <el-col :span="2">
        <el-button type="info" size="medium" @click="cancel">{{
          "取消"
        }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request"
export default {
  data() {
    return {
      form: {
        title: "",
        isComment: "1",
        isPublish: "0",
        content: "",
        boardId: -1,
      },
      aId: -1,
      // 这是表单的映射规则对象
      formRules: {
        // 验证标题是否合法
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 4,
            max: 40,
            message: "长度在 4 到 60 个字符之间",
            trigger: "blur",
          },
        ],
      },
    }
  },
  created() {
    this.aId = parseInt(this.$route.query.aId)
    this.form.boardId = this.$route.query.boardId
    if (this.aId) {
      this.getColumn()
    }
  },
  methods: {
    getColumn() {
      request
        .get(`column/${this.aId}`, {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.code !== 200) return this.$message.error(res.msg)
          this.form = res.data
        })
    },
    handleSave() {
      this.form.isPublish = "0"
      request.post("column/add", this.form).then((response) => {
        this.$message.success({
          message: "保存草稿成功",
          center: true,
        })
      })
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (!this.aId) {
          this.form.isPublish = "1"
          request.post("column/add", this.form).then((response) => {
            // 判断是否成功
            if (response.code !== 200) {
              return this.$message.error({
                message: response.msg,
                center: true,
              })
            } else {
              this.$message.success({
                message: "专栏发布成功",
                center: true,
              })
              this.$router.push({ path: "/columns" })
            }
          })
        } else {
          // 更新博客信息
          request.post("column/update", this.form).then((response) => {
            // 判断是否成功
            if (response.code !== 200) {
              return this.$message.error({
                message: response.msg,
                center: true,
              })
            } else {
              this.$message.success({
                message: "专栏更新成功",
                center: true,
              })
              this.$router.push({ path: "/columns" })
            }
          })
        }
      })
    },
    cancel() {
      this.$router.push({ path: "/columns" })
    },
  },
}
</script>
<style lang="less" scoped>
.el-col {
  cursor: pointer;
  position: relative;
  display: flex;
  overflow: hidden;
  margin-top: 15px;
}
.app-container {
  padding: 20px;
}
</style>