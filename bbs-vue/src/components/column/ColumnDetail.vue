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
          <div>
            发表于 <span>{{ detailObj.createTime }}</span> •
            <span> {{ detailObj.viewCount }} </span>次围观 •
          </div>
          <div>
            <a :href="'#/columns?boardId=' + detailObj.boardId">{{
              detailObj.boardName
            }}</a>
          </div>
        </header>
        <div v-html="detailObj.content" style="margin-top: 40px"></div>
        <div
          style="display: flex; justify-content: flex-end; align-items: center"
        >
          <!-- 新建楼层按钮 -->
          <el-button
            type="primary"
            icon="el-icon-chat-dot-round"
            @click="addFloor(-1)"
          ></el-button>
          <!-- 收藏专栏按钮 -->
          <el-button
            type="primary"
            icon="el-icon-star-on"
            @click="collect()"
          ></el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div>
        <!-- 楼层列表区域 -->
        <el-table :data="floorList" style="width: 100%" border stripe>
          <el-table-column prop="floorNum" label="楼层数" width="80">
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
                <div v-html="scope.row.rootFloor.content"></div>
              </div>

              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间">
          </el-table-column>
          <el-table-column prop="likeCount" label="点赞量" width="80">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-star-on"
                size="mini"
                @click="like(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-s-flag"
                size="mini"
                @click="report(scope.row.id)"
              ></el-button>
              <el-button
                type="primary"
                icon="el-icon-chat-dot-round"
                size="mini"
                @click="addFloor(scope.row.id)"
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
import qs from "qs"
export default {
  data() {
    //选项 / 数据
    return {
      aid: "", //专栏ID
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
    this.aid = this.$route.query.columnId
    this.getArticleDetail()
    this.getFloorList()
  },
  methods: {
    getArticleDetail() {
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
        })
    },
    // 获取楼层列表
    getFloorList() {
      this.queryInfo.columnId = this.aid
      request
        .get("floor/floorList", {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.code !== 200) return this.$message.error(res.msg)
          this.floorList = res.data.rows
          const markdownIt = mavonEditor.getMarkdownIt()
          for (var i = 0; i < this.floorList.length; i++) {
            this.floorList[i].content = markdownIt.render(
              this.floorList[i].content
            )
            if (this.floorList[i].rootId !== -1) {
              this.floorList[i].rootFloor.content = markdownIt.render(
                this.floorList[i].rootFloor.content
              )
            }
          }
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
    // 新建楼层
    addFloor(rootId) {
      this.$router.push({
        path: "/addFloor",
        query: {
          columnId: this.aid,
          rootId: rootId,
        },
      })
    },
    // 举报楼层
    report(id) {
      request.post(`floor/report/${id}`).then((res) => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success({
          message: "举报成功！",
          center: true,
        })
      })
    },
    // 点赞或取消点赞
    like(id) {
      let params = qs.stringify({
        floorId: id,
      })
      request.post("like/add", params).then((res) => {
        if (res.code !== 200) {
          request.post("like/cancel", params).then((res) => {
            if (res.code === 200) {
              this.$message.success({
                message: "取消点赞成功！",
                center: true,
              })
            } else {
              this.$message.error({
                message: res.msg,
                center: true,
              })
            }
          })
          return
        }
        this.$message.success({
          message: "点赞成功！",
          center: true,
        })
      })
    },
    // 收藏或取消收藏
    collect() {
      let params = qs.stringify({
        columnId: this.aid,
      })
      request.post("collection/add", params).then((res) => {
        if (res.code !== 200) {
          request.post("collection/cancel", params).then((res) => {
            if (res.code === 200) {
              this.$message.success({
                message: "取消收藏成功！",
                center: true,
              })
            } else {
              this.$message.error({
                message: res.msg,
                center: true,
              })
            }
          })
          return
        }
        this.$message.success({
          message: "收藏成功！",
          center: true,
        })
      })
    },
  },
}
</script>