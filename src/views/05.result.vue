<template>
  <div class="result-container">
    <div class="title-wrap">
      <!-- 标题 -->
      <h2 class="title">{{$route.query.q}}</h2>
      <span class="sub-title">{{total}}</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in songList" 
                :key="item.id" 
                class="el-table__row" 
                @dblclick="playMusic(item.id)">
              <td>{{index + 1}}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌名 -->
                    <span>{{item.name}}</span>
                    <!-- mv的图标 -->
                    <span v-if="item.mvid!=0" class="iconfont icon-mv"></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alias.length!=0">{{item.alias[0]}}</span>
                </div>
              </td>
              <td>{{item.artists[0].name}}</td>
              <td>{{item.album.name}}</td>
              <!-- 全局过滤器修改时间格式 -->
              <td>{{item.duration | formatDuration}}</td>
              <!-- <td>{{item.duration}}</td> -->
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" 
          v-for="item in playList" 
          :key="item.id"
          @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <!-- 使用全局过滤器 -->
                <span class="num">{{item.playCount | formatCount}}</span>
                <!-- <span class="num">{{item.playCount}}</span> -->
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="item in mvList" :key="item.id" @click="toMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
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
      </el-tab-pane>
    </el-tabs>
        <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'result',
  data() {
    return {
      // tab切换时会改变的数据
      activeIndex: 'songs',
      // 歌曲歌单MV传递类型
      type: '1',
      
      // 保存查询歌曲
      songList:[],
      // 保存歌单的字段
      playList:[],
      // 保存mv的字段
      mvList:[],

      // 页容量
      limit: 10,
      // 页码
      page: 1,
      // 总条数，也是搜索结果的总数
      total: 0,
 
    };
  },
  watch: {
    // 监听activeIndex改变，修改传值的type和limit
    activeIndex() {
      // songs 歌曲
      // lists 歌单
      // mv    mv
      switch (this.activeIndex) {
        case 'songs':
          this.type = '1';
          this.limit = 10
          break;
        case 'lists':
          this.type = '1000';
          this.limit = 10
          break;
        case 'mv':
          this.type = '1004';
          this.limit = 12
          break;
      }
      this.searchResult()
      this.page = 1
    },
    // 监听路由：简单写法
    // '$route.query.q': 'searchResult'
    // 监听路由：详细写法
    "$route.query.q":{
      handler() {
        this.searchResult();
      },
    }
  },
  created() {
    this.searchResult()
  },
  methods: {
    // 去MV页面
    toMv(id){
      this.$router.push(`/mv?q=${id}`)
    },
    // 去歌单详情页
    toPlaylist(id){
      // this.$router.push('/playlist?q=' + id)
      this.$router.push(`/playlist?q=${id}`)
    },
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
    searchResult(){
      axios({
        url:'https://lianghj.top:3000/search',
        method:'get',
        params:{
          keywords:this.$route.query.q,
          type:this.type,
          limit:this.limit,
          offset:(this.page - 1) * this.limit
        }
      }).then(res=>{
        switch (this.type) {
          case '1':
            this.songList = res.data.result.songs;
            this.total = res.data.result.songCount;
            break;
          case '1000':
            this.playList = res.data.result.playlists;
            this.total = res.data.result.playlistCount;
            break;
          default:
            this.mvList = res.data.result.mvs;
            this.total = res.data.result.mvCount;
            break;
          }
      })
    },
    // 页面改变事件 
    handleCurrentChange(val) {
      // 保存当前页码
      this.page = val
      // 重新获取数据
      this.searchResult()
    },
  },
  
};
</script>

<style >

</style>
