<template>
  <div class="wrapper">
    <el-row :gutter="20">
      <el-col :span="16">
        <!-- 卡片视图区 -->
        <el-card class="main">
          <!-- 标题区域 -->
          <div class="head">
            <h1>热门专栏</h1>
          </div>
          <!-- 板块列表区域 -->
          <el-table :data="columnList" style="width: 100%" border stripe>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="title" label="标题">
              <template slot-scope="scope">
                <div
                  style="cursor: pointer"
                  @click="columnDetail(scope.row.id)"
                >
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="viewCount" label="浏览量" width="65">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!-- 卡片视图区 -->

      <el-col :span="8">
        <el-card class="right">
          <div class="head">
            <h1>右侧广告位</h1>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 卡片视图区 -->
    <el-card class="bottom">
      <div class="head">
        <h1>底部广告位</h1>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request"
export default {
  data() {
    return {
      columnList: [],
    }
  },
  created() {
    this.getColumnList()
  },
  methods: {
    getColumnList() {
      request.get("column/hotColumnList").then((res) => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.columnList = res.data
      })
    },
    // 查看专栏详情
    columnDetail(columnId) {
      this.$router.push({
        path: "/columnDetail",
        query: {
          columnId: columnId,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.head {
  font-size: 25px;
  margin-left: 40px;
}

.main {
  background-color: #fff !important;
}

.right {
  height: 100%;
  background-color: #fff !important;
}

.bottom {
  position: fixed;
  bottom: 0;
  width: 86%;
  line-height: var(--footer-height);
  background-color: #fff !important;
  margin-right: 15px;
}
</style>