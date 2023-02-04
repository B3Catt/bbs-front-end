<!-- 文章详情模块 -->
<template>
  <!-- 卡片视图区 -->
  <el-card>
    <el-card>
      <div class="detailBox tcommonBox">
        <header>
          <h2>
            <a>
              {{ detailObj.title }}
            </a>
          </h2>
          <h1>
            发表于 <span>{{ detailObj.createTime }}</span> •
            {{ detailObj.viewCount }} 次围观 •
          </h1>
          <div class="ui label">
            <a :href="'#/columns?boardId=' + detailObj.boardId">{{
              detailObj.boardName
            }}</a>
          </div>
        </header>
        <div
          class="article-content markdown-body"
          v-html="detailObj.content"
        ></div>
      </div>
    </el-card>
    <el-card>
      <div>
        <!-- 板块列表区域 -->
        <el-table :data="floorList" style="width: 100%" border stripe>
          <el-table-column prop="floorNum" label="楼层数" width="60">
          </el-table-column>
          <el-table-column prop="userName" label="发布者">
            <template slot-scope="scope">
              <div
                style="cursor: pointer"
                @click="getUserInfo(scope.row.userId)"
              >
                {{ scope.row.userName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="内容" width="700">
            <template slot-scope="scope">
              <div
                v-if="scope.row.rootId != -1"
                style="
                  border-style: dotted;
                  border-color: #98bf21;
                  border-width: 1px;
                  padding: 10px;
                  margin-bottom: 10px;
                "
              >
                <div
                  style="cursor: pointer"
                  @click="getUserInfo(scope.row.userId)"
                >
                  回复：
                  {{ scope.row.userName }}
                </div>
                <div>{{ scope.row.rootFloor.content }}</div>
              </div>
              <div>{{ scope.row.content }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间">
          </el-table-column>
          <el-table-column prop="likeCount" label="点赞量" width="60">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-star-on"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-s-flag"
                size="mini"
              ></el-button>
              <el-button
                type="primary"
                icon="el-icon-chat-dot-round"
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
      </div>
    </el-card>
  </el-card>
</template>

<script>
import request from "@/utils/request"
import { mavonEditor } from "mavon-editor"
export default {
  data() {
    //选项 / 数据
    return {
      aid: "", //文章ID
      detailObj: {}, //返回详情数据
      haslogin: false, //是否已经登录

      // 获取楼层列表的参数对象
      queryInfo: {
        columnId: -1,
        pageNum: 1,
        pageSize: 2,
      },
      floorList: [],
      total: 0,
    }
  },
  created() {
    this.getArticleDetail()
  },
  methods: {
    getArticleDetail() {
      this.aid = this.$route.query.columnId
      request.put(`column/updateViewCount/${this.aid}`)
      request
        .get(`column/${this.aid}`, {
          params: this.queryInfo,
        })
        .then((response) => {
          this.detailObj = response.data
          const markdownIt = mavonEditor.getMarkdownIt()
          // markdownIt.re
          this.detailObj.content = markdownIt.render(response.data.content)
          this.getFloorList()
        })
    },
    // 获取楼层列表
    getFloorList() {
      this.queryInfo.columnId = this.detailObj.id
      request
        .get("floor/floorList", {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.code !== 200) return this.$message.error(res.msg)
          this.floorList = res.data.rows
          this.total = res.data.total
        })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getFloorList()
    },
    // 监听 pageNum 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getFloorList()
    },
    // 新建专栏
    addFloor() {
      this.$router.push({
        path: "addColumns",
        query: {
          aId: 0,
          boardId: this.queryInfo.boardId,
        },
      })
    },
    // 查看用户信息
    getUserInfo(userId) {
      this.$router.push({
        path: "/getUserInfo",
        query: {
          userId: userId,
        },
      })
    },
  },
}
</script>