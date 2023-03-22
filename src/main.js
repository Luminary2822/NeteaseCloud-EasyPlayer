/*
 * @Description: 
 * @Author: Luminary
 * @Date: 2020-03-07 10:57:57
 * @LastEditTime: 2022-04-14 22:01:18
 */
import Vue from 'vue'
import App from './App.vue'

// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
Vue.use(ElementUI)

// 导入全局初始化样式
import './assets/index.css'

// 路由整合
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入对应的路由
import discovery from './views/01.discovery.vue'
import playlists from './views/02.playlists.vue'
import songs from './views/03.songs.vue'
import mvs from './views/04.mvs.vue'
import result from './views/05.result.vue'
import playlist from './views/06.playlist.vue'
import mv from './views/07.mv.vue'

/**
 * 重写路由的push方法
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    {
      // 发现音乐
      path: '/discovery',
      component: discovery
    },
    {
      // 推荐歌单
      path: '/playlists',
      component: playlists
    },
    {
      // 推荐歌单
      path: '/playlist',
      component: playlist
    },
    {
      // 最新音乐
      path: '/songs',
      component: songs
    },
    {
      // 最新音乐
      path: '/mvs',
      component: mvs
    },
    // mv详情
    {
      path: '/mv',
      component: mv
    },
    // 搜索结果页
    {
      path: '/result',
      component: result
    }
  ]
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router
}).$mount('#app')

import moment from 'moment';
// 全局过滤器
// Vue.filter('formatDuration',(dt)=>{
//   // 转分
//   let min = Math.ceil(dt / 1000 / 60);
//   min = min < 10 ? '0' + min : min;
//   // 秒
//   let sec = Math.ceil((dt / 1000) % 60);
//   sec = sec < 10 ? '0' + sec : sec;
//   return min + ':' + sec;
// })
// 处理歌曲时长：分：秒
Vue.filter('formatDuration',(dt)=>{
  return moment(dt).format('mm:ss')
})

// 处理播放次数，大于十万显示xx万
Vue.filter('formatCount',(count)=>{
  if (count / 10000 > 10) {
    return parseInt(count / 10000) + '万';
  } else {
    return count;
  }
})
// 处理日期时间：年月日时分秒
Vue.filter('formatTime', (time)=>{
  return moment(time).format('YYYY-MM-DD hh:mm:ss');
})

// 处理日期：年月日
Vue.filter('formatDate', (time)=>{
  return moment(time).format('YYYY-MM-DD')
})

