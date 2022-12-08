<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
import { removeToken } from "@/utils/auth"

export default {
  methods: {
    logout() {
      removeToken()
      this.$router.push("/login")
    },
  },
}
</script>

<style lang="less" scoped>
</style>