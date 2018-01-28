<template>
  <div id='app'>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'lite-reader',
    mounted() {
      // 禁用浏览器默认拖拽事件，防止用户拖拽的文件被打开
      document.addEventListener('drop', e => e.preventDefault(), false);
      document.addEventListener('dragenter', e => e.preventDefault(), false);
      document.addEventListener('dragleave', e => e.preventDefault(), false);
      document.addEventListener('dragover', e => e.preventDefault(), false);
      // 获取 APP 列表
      this.$store.dispatch('fetchAppList').catch(() => {});
    }
  };
</script>

<style lang='scss'>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    text-decoration: none;
  }

  body, html {
    width: 100%;
    height: 100%;
    font-size: 62.5%;
  }

  #app {
    color: #303133;
    width: 100%;
    height: 100%;
    font-size: 1.6rem;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
</style>
