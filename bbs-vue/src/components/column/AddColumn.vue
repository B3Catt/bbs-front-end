<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="90px">
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
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" size="medium" @click="handleSubmit">{{
          aId ? "更新" : "发布"
        }}</el-button>
        <el-button v-if="!aId" type="info" @click="handleSave"
          >保存到草稿箱</el-button
        >
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
        content: "",
      },
      aId: -1,
    }
  },
  created() {
    this.aId = this.$route.query.aId
    if (this.aId) {
      this.getArticle()
    }
  },
  methods: {
    getArticle() {},
    handleSave() {
      this.form.status = "1"
      addArticle(this.form).then((response) => {
        this.$modal.msgSuccess("保存草稿成功")
      })
    },
    handleSubmit() {
      if (!this.aId) {
        this.form.status = "0"
        addArticle(this.form).then((response) => {
          this.$modal.msgSuccess("博客发布成功")
          this.$router.push({ path: "/content/article" })
        })
      } else {
        // 更新博客信息
        updateArticle(this.form).then((response) => {
          this.$modal.msgSuccess("博客更新成功")
          this.$router.push({ path: "/content/article" })
        })
      }
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