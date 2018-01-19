<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'lite-reader',
    data() {
      return {
        appList: []
      };
    },
    mounted() {
      this.$store.dispatch('fetchAppList').catch(() => {
        this.$router.push('/error');
      });
    }
  };
</script>

<style lang="scss">
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
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
</style>
