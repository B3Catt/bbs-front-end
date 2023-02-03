<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 信息表格区域 -->
      <el-descriptions title="用户信息">
        <el-descriptions-item label="昵称">{{
          userInfo.nickName
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{
          userInfo.userSex
        }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{
          userInfo.userAge
        }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{
          userInfo.userEmail
        }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{
          userInfo.userSchool
        }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{
          userInfo.userMajor
        }}</el-descriptions-item>
        <el-descriptions-item label="获浏览数">{{
          userInfo.viewCount
        }}</el-descriptions-item>
        <el-descriptions-item label="获收藏数">{{
          userInfo.collectionCount
        }}</el-descriptions-item>
        <el-descriptions-item label="获点赞数">{{
          userInfo.likeCount
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request"
export default {
  data() {
    return {
      userInfo: {},
      id: -1,
    }
  },
  created() {
    this.id = this.$route.query.userId
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      request.get(`user/${this.id}`).then((res) => {
        // 判断是否成功
        if (res.code !== 200) {
          return this.$message.error({
            message: res.msg,
            center: true,
          })
        }
        this.userInfo = res.data
        if (this.userInfo.userSex == "0") {
          this.userInfo.userSex  = "男"
        } else if (this.userInfo.userSex == "1") {
          this.userInfo.userSex  = "女"
        } else {
          this.userInfo.userSex  = "未知"
        }
        console.log(this.userInfo)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.row {
  display: flex;
  align-items: center;
  margin-top: 25px;
  margin-left: 40px;
}

.head {
  display: flex;
  align-items: center;
  font-size: 25px;
  margin-top: 25px;
  margin-left: 40px;
}
</style>

