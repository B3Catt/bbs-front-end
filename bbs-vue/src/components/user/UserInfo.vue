<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 标题区域 -->
      <div class="head">
        <h1>个人信息</h1>
      </div>
      <!-- 信息表格区域 -->
      <el-form :model="userInfoForm" ref="userInfoFormRef" label-width="80px">
        <el-row>
          <el-col class="line" :span="6">
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="userInfoForm.nickName"
                :disabled="!isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="6">
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="userInfoForm.userEmail" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="line" :span="6">
            <el-form-item label="性别" prop="userSex">
              <el-radio-group
                v-model="userInfoForm.userSex"
                :disabled="!isEdit"
              >
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <el-radio label="2">未知</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="6">
            <el-form-item label="年龄" prop="userAge">
              <el-input
                v-model="userInfoForm.userAge"
                :disabled="!isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="line" :span="6">
            <el-form-item label="学校" prop="userSchool">
              <el-input
                v-model="userInfoForm.userSchool"
                :disabled="!isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="6">
            <el-form-item label="专业" prop="userMajor">
              <el-input
                v-model="userInfoForm.userMajor"
                :disabled="!isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="line" :span="4">
            <el-form-item label="浏览量" prop="viewCount">
              <el-input v-model="userInfoForm.viewCount" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="4">
            <el-form-item label="获赞数" prop="likeCount">
              <el-input v-model="userInfoForm.likeCount" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="4">
            <el-form-item label="被收藏数" prop="collectionCount">
              <el-input
                v-model="userInfoForm.collectionCount"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 底部区域 -->
        <div class="row">
          <el-button @click="editUserInfo" type="primary" v-if="!isEdit"
            >编 辑<i class="el-icon-edit" style="margin-left: 5px"></i
          ></el-button>

          <el-button type="success" v-if="isEdit" @click="save"
            >确 定
          </el-button>
          <el-button
            @click="
              userInfoForm = userInfo
              isEdit = false
            "
            v-if="isEdit"
            style="margin-left: 15px"
            >取 消</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request"
export default {
  data() {
    return {
      userInfoForm: {},
      ruleForm: {},
      isEdit: false,
      userInfo: {},
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      request.get("user/userInfo").then((res) => {
        // 判断是否成功
        if (res.code !== 200) {
          return this.$message.error({
            message: res.msg,
            center: true,
          })
        }
        this.userInfo = res.data
        this.userInfoForm = res.data
      })
    },
    editUserInfo() {
      this.isEdit = true
    },
    save() {
      request.put("user/userInfo", this.userInfoForm).then((res) => {
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
        this.isEdit = false
        localStorage.setItem("userInfo", JSON.stringify(this.userInfoForm))
        this.$emit("changeUserInfo")
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

