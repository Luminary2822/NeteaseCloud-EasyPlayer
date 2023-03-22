<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <!-- 歌单名字 -->
        <p class="title">{{playlist.name}}</p>
        <div class="author-wrap">
          <!-- 创建者信息 -->
          <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
          <span class="name">{{playlist.creator.nickname}}</span>
          <span class="time">{{playlist.createTime | formatDate}} 创建</span>
        </div>
        <!-- <div class="play-wrap" @click="playAllMusic()"> -->
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <!-- 标签 -->
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item,index) in playlist.tags" :key="index">{{item}}</li>
            <!-- 如果标签不存在，显示无 -->
            <li v-if="playlist.tags.length == 0">无</li>
          </ul>
        </div>
        <!-- 简介 -->
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{playlist.description}}</span>
          <!-- 如果简介不存在，显示无 -->
          <span class="desc" v-if="playlist.tags.length == 0">无</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in songlist" :key="item.id"
            @dblclick="playMusic(item.id)">
              <td>{{index + 1}}</td>
              <td>
                <div class="img-wrap">
                  <!-- 封面 -->
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌曲名 -->
                    <span>{{item.name}}</span>
                    <!-- MV图标 -->
                    <span v-if="item.mv!=0" class="iconfont icon-mv"></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alia.length!=0">{{item.alia[0]}}</span>
                </div>
              </td>
              <!-- 作者、专辑名和时长 -->
              <td>{{item.ar[0].name}}</td>
              <td>{{item.al.name}}</td>
              <td>{{item.dt | formatDuration}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <!-- 动态绑定评论数：普通评论个数+热门评论个数 -->
      <el-tab-pane :label="`评论(${total + hotCount})`" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap" v-if="hotComments.length != 0">
          <p class="title">精彩评论 <span class="number">{{hotCount}}</span></p>
          <div class="comments-wrap">
            <!-- 评论 -->
            <div class="item" v-for="item in hotComments" :key="item.commentId">
              <div class="icon-wrap">
                <!-- 头像 -->
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <!-- 昵称和内容 -->
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <!-- 回复信息 -->
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <!-- 使用全局过滤器格式化时间：YYYY-MM-DD hh:mm:ss -->
                <div class="date">{{ item.time | formatTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap" v-if="comments.length != 0">
          <p class="title">最新评论 <span class="number">{{total}}</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="item in comments" :key="item.commentId">
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
                <!-- 评论回复：判断回复评论数组是否存在，再决定是否显示 -->
                <div class="re-content" v-if="item.beReplied.length!=0">
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
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'playlist',
  data() {
    return {
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单详情数据
      playlist:{},
      // 歌曲列表数据
      songlist:[],
      // 热门评论
      hotComments:[],
      // 热门评论个数
      hotCount:0,
      // 普通评论
      comments:[]
    };
  },
  created() {
    // 获取歌单详情
    axios({
      url:'https://lianghj.top:3000/playlist/detail',
      method:'get',
      params:{
        id:this.$route.query.q
      }
    }).then(res=>{
      this.playlist = res.data.playlist
      this.songlist = res.data.playlist.tracks
    })
    // 获取热门评论
    axios({
      url:'https://lianghj.top:3000/comment/hot',
      method:'get',
      params:{
        id:this.$route.query.q,
        // 传递类型：歌单
        type:2
      }
    }).then(res=>{
      this.hotComments = res.data.hotComments
      this.hotCount = res.data.total
    })
    // 普通评论
    this.getComments()
  },
  
  methods: {
    // 播放音乐
    playMusic(id){
      axios({
        url:'https://lianghj.top:3000/song/url',
        method:'get',
        params:{
          id
        }
      }).then(res=>{
        let url = res.data.data[0].url
        // 设置给父组件的播放地址
        this.$parent.musicUrl = url
      })
    },
    // 获取普通评论
    getComments(){
      axios({
        url:'https://lianghj.top:3000/comment/playlist',
        method:'get',
        params:{
          id:this.$route.query.q,
          limit:10,
          offset:(this.page - 1)*10
        }
      }).then(res=>{
        // 总个数
        this.total = res.data.total
        // 评论数
        this.comments = res.data.comments
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getComments()
    },
    // playAllMusic(){
    //   for(let item of this.songlist){
    //     this.playMusic(item.id)
    //   }
    // }
  }
};
</script>

<style >

</style>
