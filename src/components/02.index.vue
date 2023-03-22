<!--
 * @Description: 
 * @Author: Luminary
 * @Date: 2020-03-07 10:57:57
 * @LastEditTime: 2022-04-15 14:16:31
-->
<template>
  <div class="index-container">
    <!-- 导航区域 -->
    <div class="nav" >
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 主体区域 -->
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 播放标签 -->
    <div class="player">
      <!-- autoplay自动播放 -->
      <audio :src='musicUrl' controls autoplay> </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      // 这个地址老是报403错误
      // musicUrl:"http://m7.music.126.net/20200303182550/8aa5971b1630d1527a922ccd2b97f392/ymusic/035d/0109/520e/478f86cc9f6c6539f7c8ed3e06c1bf8e.mp3"
      musicUrl:""
    };
  }
};
</script>

<style >

</style>
