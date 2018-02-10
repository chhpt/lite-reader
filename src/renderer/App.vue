<template>
  <div id='app'>
    <div class="bar">
    </div>
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
      this.$store.dispatch('fetchAppList').catch(() => {
      });
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
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #303133;
    overflow-y: hidden;
  }

  #app {
    padding-top: 4rem;
    width: 100%;
    height: 100%;
    font-size: 1.6rem;
    color: #303133;
    overflow-y: auto;
    &::-webkit-scrollbar {
      background: #fff;
      width: 0.3rem;
    }

    &:hover::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #fff;
    }

    &:hover::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px #000;
    }
  }

  .bar {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    width: 100%;
    height: 4rem;
    background: #606266;
    z-index: 100;
    /*窗口拖拽*/
    -webkit-app-region: drag;
    i {
      color: #fff;
      margin-left: 12rem;
    }
  }
</style>
