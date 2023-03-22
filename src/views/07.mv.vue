<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          :src="url"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <!-- 头像 -->
            <img :src="artistIcon" alt="" />
          </div>
          <!-- 歌手名 -->
          <span class="name">{{mvInfo.artistName}}</span>
        </div>
        <div class="mv-info">
          <!-- 标题 -->
          <h2 class="title">{{mvInfo.name}}</h2>
          <span class="date">发布：{{mvInfo.publishTime}}</span>
          <!-- 播放次数 -->
          <span class="number">播放：{{mvInfo.playCount | formatCount}}次</span>
          <!-- 描述 -->
          <p class="desc">{{mvInfo.desc}}</p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotComments.length != 0" >
        <p class="title">精彩评论<span class="number">{{hotComments.length}}</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="item in hotComments" :key="item.commentId">
            <div class="icon-wrap">
              <!-- 评论者头像 -->
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <!-- 评论者昵称和评论内容 -->
                <span class="name">{{item.user.nickname}}：</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <!-- 回复信息，有则显示 -->
              <div class="re-content" v-if="item.beReplied.length!=0">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <!-- 全局过滤器格式化时间 -->
              <div class="date">{{ item.time | formatTime}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap" v-if="comments.length != 0">
        <p class="title">最新评论<span class="number">{{total}}</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="item in comments" :key="item.commentId">
            <div class="icon-wrap">
              <!-- 评论者头像 -->
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <!-- 评论者昵称和内容 -->
                <span class="name">{{item.user.nickname}}：</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <!-- 评论回复：判断回复评论数组是否存在，再决定是否显示 -->
              <div class="re-content"  v-if="item.beReplied.length!=0">
                <!-- 评论回复者的昵称和内容 -->
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <!-- 使用全局过滤器格式化时间：YYYY-MM-DD hh:mm:ss -->
              <div class="date">{{item.time | formatTime}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="10"
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="item in simiMvs" :key="item.id">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play" @click="changeMV(item.id)"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount | formatCount}}</div>
              </div>
              <span class="time">{{item.duration | formatDuration}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'mv',
  data() {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      // mv地址
      url:"",
      // 相关推荐MV
      simiMvs:[],
      // MV信息
      mvInfo:{},
      // 歌手头像
      artistIcon:'',
      // MV热门评论
      hotComments:[],
      // MV普通评论
      comments:[]
    };
  },
  watch: {
    '$route.query.q'() {
      this.getMvInfo()
      this.page = 1
    }
  },
  created() {
    this.getMvInfo()
  },
  
  methods: {
    getMvInfo(){
      this.getMvUrl()
      this.getSimiMv()
      this.getMvDetail()
      this.getComments()
    },
    // 获取MV播放地址
    getMvUrl(){
      axios({
      url:'https://lianghj.top:3000/mv/url',
      method:'get',
      params:{
        // 获取url中的id
        id:this.$route.query.q
      }
    }).then(res=>{
      this.url = res.data.data.url
    })
    },
    // 获取相关推荐MV
    getSimiMv(){
      axios({
      url:'https://lianghj.top:3000/simi/mv',
      method:'get',
      params:{
        mvid:this.$route.query.q
      }
      }).then(res=>{
        this.simiMvs = res.data.mvs
      })
    },
    // 获取MV的信息
    getMvDetail(){
      axios({
        url:'https://lianghj.top:3000/mv/detail',
        method:'get',
        params:{
          mvid:this.$route.query.q
        }
      }).then(res=>{
        // 获取MV信息
        this.mvInfo = res.data.data
        // 获取歌手信息
        axios({
          url:'https://lianghj.top:3000/artists',
          method:'get',
          params:{
            id:this.mvInfo.artists[0].id
          }
        }).then(res=>{
          // 歌手的封面信息
          this.artistIcon = res.data.artist.picUrl
        })
      })
    },
    // 获取MV评论
    getComments(){
      axios({
        url:'https://lianghj.top:3000/comment/mv',
        method:'get',
        params:{
          id:this.$route.query.q,
          limit:10,
          offset:(this.page - 1)*10
        }
      }).then(res=>{
        if(res.data.hotComments)
          this.hotComments = res.data.hotComments
        this.comments = res.data.comments
        this.total = res.data.total
        
      })
    },
    // 点击相关推荐里面的mv, 可以切换mv
    changeMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
    // 处理分页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val
      this.getComments();
    }
  }
};
</script>

<style></style>
