<!--
 * @Description: 
 * @Author: Luminary
 * @Date: 2020-03-07 10:57:57
 * @LastEditTime: 2022-04-14 22:03:06
-->
<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <!-- <span class="iconfont icon-home"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span> -->
        <span @click="$router.replace('/')" class="iconfont icon-home"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div>
      <div class="history-wrapper">
        <!-- <span class="iconfont icon-arrow-lift"></span>
        <span class="iconfont icon-arrow-right"></span> -->
        <span @click="$router.go(-1)" class="iconfont icon-arrow-lift"></span>
        <span @click="$router.go(1)" class="iconfont icon-arrow-right"></span>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <!-- 搜索框 -->
        <input
          type="text"
          autocomplete="off"
          placeholder="搜索"
          class="el-input__inner"
          v-model="inputValue"
          @keyup.enter="toResult"
        />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'top',
    data() {
      return {
        // 输入的内容
        inputValue: ''
      }
    },
    methods: {
      toResult() {
        // 非空判断
        if(this.inputValue == ''){
          // 提示用户
          this.$message.warning('请输入内容')
        }
        else{
          // 去搜索页  携带数据
          this.$router.push('/result?q=' + this.inputValue)
        }
        
      },
    },
  }
</script>

<style scoped></style>
