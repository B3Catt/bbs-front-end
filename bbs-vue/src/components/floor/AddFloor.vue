<template>
  <div class="app-container">
    <el-row :gutter="20" />
    <el-row>
      <mavon-editor ref="md" v-model="floor.content" />
    </el-row>

    <el-row :gutter="50">
      <el-col :span="22">
        <el-button type="primary" size="medium" @click="handleSubmit">{{
          "发布"
        }}</el-button>
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
      floor: {
        content: "",
        columnId: -1,
        rootId: -1,
      },
    }
  },
  created() {
    this.floor.columnId = this.$route.query.columnId
    this.floor.rootId = this.$route.query.rootId
  },
  methods: {
    handleSubmit() {
      request.post("floor/add", this.floor).then((response) => {
        // 判断是否成功
        if (response.code !== 200) {
          return this.$message.error({
            message: response.msg,
            center: true,
          })
        } else {
          this.$message.success({
            message: "楼层发布成功",
            center: true,
          })
          this.$router.push({
            path: `/columnDetail?columnId=${this.$route.query.columnId}`,
          })
        }
      })
    },
    cancel() {
      this.$router.push({
        path: `/columnDetail?columnId=${this.$route.query.columnId}`,
      })
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