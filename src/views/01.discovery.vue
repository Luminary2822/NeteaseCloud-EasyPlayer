<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <!-- 循环获取到的接口数据 -->
      <!-- 其实key不应该用index，但是用encodeid因为第一条数据有0会报警告，所以还是写了index了 -->
      <el-carousel-item v-for="(item,index) in banners" :key="index">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item" v-for=" item in list" :key = 'item.id' @click="toPlaylist(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <!-- 描述 -->
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <!-- 封面 -->
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <!-- 歌单名 -->
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">
        <div class="item" v-for="item in songs" :key='item.id'>
          <div class="img-wrap">
            <!-- 封面 -->
            <img :src="item.picUrl" alt="" />
            <!-- 传入当前歌曲id -->
            <span @click="playMusic(item.id)" class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <!-- 歌名和歌手名 -->
            <div class="song-name">{{item.name}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="item in mvs" :key="item.id" @click="toMv(item.id)">
          <div class="img-wrap">
            <!-- 封面 -->
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <!-- 播放次数 -->
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <!-- mv名和歌手名 -->
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 导入axios
import axios from 'axios'
export default {
  name: 'discovery',
  data() {
    return {
      // 轮播图
      banners:[],
      // 推荐歌单
      list:[],
      // 最新音乐
      songs:[],
      // 推荐MV
      mvs:[]
    };
  },
  created() {
    // 1. 轮播图接口
    axios({
      url:'https://lianghj.top:3000/banner',
      method:'get',
    }).then(res=>{
      this.banners = res.data.banners
    })
    // 2. 推荐歌单
    axios({
      url:'https://lianghj.top:3000/personalized',
      method:'get',
      params:{
        limit:10
      }// limit取出数量，默认30
    }).then(res=>{
      this.list = res.data.result
    })
    // 3. 最新音乐
    axios({
      url:'https://lianghj.top:3000/personalized/newsong',
      method:'get',
      params:{}
    }).then(res=>{
      this.songs = res.data.result
    })
    // 推荐MV
    axios({
      url:'https://lianghj.top:3000/personalized/mv',
      method:'get',
      params:{}
    }).then(res=>{
      this.mvs = res.data.result
    })
  },
  methods: {
    // 点击播放
    playMusic(id) {
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
    // 去歌单详情页
    toPlaylist(id){
      this.$router.push(`/playlist?q=${id}`)
    },
    // 去MV页面
    toMv(id){
      this.$router.push(`/mv?q=${id}`)
    },
  },
  
};
</script>

<style >

</style>
