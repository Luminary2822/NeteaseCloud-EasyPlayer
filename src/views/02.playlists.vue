<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面 -->
        <img :src="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">
          {{topList.name}}
        </div>
        <!-- 介绍 -->
        <div class="info">
          {{topList.description}}
        </div>
      </div>
      <!-- 背景：和封面的数据是一样的，只不过样式不同-->
      <img :src="topList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <!-- 利用watch监听tag值的变化 -->
        <span class="item" :class="{active:tag=='全部'}" @click="tag='全部'">全部</span>
        <span class="item" v-for="item in catlist_cut" :class="{active:tag==item.name}" @click="tag=item.name" :key="item.id">{{item.name}}</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="item in list" :key="item.id" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <!-- <span class="num">{{item.playCount}}</span> -->
                <span class="num">{{item.playCount  | formatCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <!-- total 总条数 
         current-page 当前页
         page-size 每页多少条
         handleCurrentChange 页面改变事件
    -->
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
  name: 'recommend',
  data() {
    return {
      // 总条数
      total:0,
      // 页码
      page:1,
      // 顶部的推荐歌单，只有一个歌单，所以这里建的是一个对象
      topList:{},
      // 歌单列表
      list:[],
      // 歌单分类
      catlist:[],
      // 切换分类：当前选择的数据
      tag:'全部',
    };
  },
  // 侦听器
  watch: {
    tag() {
      // 可以实时监听tag的值，点击哪个分类tag就会改变，watch可以获取到
      // 顶部的精品歌单
      this.topData()
      // 歌单列表
      this.listData()
      // 修改分类的时候，设置页码为1
      this.page = 1
    },
  },
  created() {
    // 顶部的精品歌单
    this.topData()
    // 歌单列表
    this.listData()
    // 歌单类别
    axios({
      url:'https://lianghj.top:3000/playlist/catlist',
      method:'get',
      params:{
      }
    }).then(res=>{
      this.catlist = res.data.sub
    })
  },
  methods: {
    // 抽取的方法1 顶部数据
    topData(){
      axios({
        url:'https://lianghj.top:3000/top/playlist/highquality',
        method:'get',
        params:{
          limit:1,
          cat:this.tag
        }
      }).then(res=>{
        this.topList = res.data.playlists[0]
      })
    },
    // 抽取的方法2 列表数据
    listData(){
      axios({
        url:'https://lianghj.top:3000/top/playlist',
        method:'get',
        params:{
          limit:10,
          // 起始值，（页码-1）*每一页多少条数据
          // 页码改变的时候改变offset的值，偏移数量用于分页
          offset:(this.page - 1) * 10,
          // 分类数据
          cat:this.tag
        }
      }).then(res=>{
        // 保存数据
        this.list = res.data.playlists
        // 保存总条数
        this.total = res.data.total
      })
    },
    // 页面改变事件 
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 保存当前页码
      this.page = val
      // 重新获取数据
      this.listData()
    },
    // 去歌单详情页
    toPlaylist(id){
      this.$router.push(`/playlist?q=${id}`)
    },
  },
  // 使用计算属性处理需要的类别，只显示十个类别
  computed: {
    catlist_cut() {
      return this.catlist.slice(0,10);
    },
  
  },
}
</script>
<style>
</style>