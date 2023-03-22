<!--
 * @Description: 
 * @Author: Luminary
 * @Date: 2020-03-07 10:57:57
 * @LastEditTime: 2022-04-15 14:24:38
-->
<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" @click="tag=0" :class="{active:tag==0}">全部</span>
      <span class="item" @click="tag=7" :class="{active:tag==7}">华语</span>
      <span class="item" @click="tag=96" :class="{active:tag==96}">欧美</span>
      <span class="item" @click="tag=8" :class="{active:tag==8}">日本</span>
      <span class="item" @click="tag=16" :class="{active:tag==16}">韩国</span>
    </div>
    <!--底部的table -->
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
        <tr v-for="(item,index) in lists" class="el-table__row" :key="item.id">
          <td>{{index + 1}}</td>
          <td>
            <div class="img-wrap">
              <!-- 封面 -->
              <img :src="item.album.picUrl" alt="" />
              <!-- 播放按钮 -->
              <span @click="playMusic(item.id)" class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.name}}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span v-if="item.alias.length!=0" >{{item.alias[0]}}</span>
            </div>
          </td>
          <td>{{item.album.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <!-- 使用全局过滤器定义分秒 -->
          <td>{{item.duration | formatDuration}}</td>
          <!-- 不使用全局过滤器，在数据处理的时候规范分秒 -->
          <!-- <td>{{item.duration}}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  // 导入axio
  import axios from 'axios'
export default {
  name: 'songs',
  data() {
    return {
      // 歌曲列表
      lists:[],
      tag:'0'
 
    };
  },
  watch: {
    tag() {
      this.getList()
    },
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      axios({
      url:'https://lianghj.top:3000/top/song',
      method:'get',
      params:{
        // 传递设置的数据
        type:this.tag
      }
    }).then(res=>{
      this.lists = res.data.data
      // 处理时长毫秒转为分秒，可以使用全局过滤器。
      // for(let i = 0;i < this.lists.length;i++){
      //   // 获取总毫秒
      //   let duration = this.lists[i].duration
      //   // 转换分
      //   let min = parseInt(duration/1000/60)
      //   min = min < 10 ? '0' + min : min;
      //   // 转化剩余的秒
      //   let sec = parseInt(duration/1000%60)
      //   sec = sec < 10 ? '0' + sec : sec;
      //   this.lists[i].duration = `${min}:${sec}`
      // }.
      })
    },
     // 播放歌曲
    playMusic(id) {
      axios({
        url:'https://lianghj.top:3000/song/url',
        method:'get',
        params:{
          id
        }
      }).then(res=>{
        let url = res.data.data[0].url
        // 直接获取父组件，可以修改任意的值
        // 设置给父组件的播放地址
        this.$parent.musicUrl = url
      })
    }
  },
};
</script>

<style >

</style>
