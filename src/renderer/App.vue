<template>
  <div id='app'>
    <router-view></router-view>
  </div>
</template>

<script>
  import { shell } from 'electron';
  import { mapGetters } from 'vuex';

  export default {
    name: 'lite-reader',
    computed: {
      barBackground() {
        return this.themeColor.value;
      },
      ...mapGetters([
        'themeColor',
        'opened'
      ])
    },
    mounted() {
      // 禁用浏览器默认拖拽事件，防止用户拖拽的文件被打开
      document.addEventListener('drop', e => e.preventDefault(), false);
      document.addEventListener('dragenter', e => e.preventDefault(), false);
      document.addEventListener('dragleave', e => e.preventDefault(), false);
      document.addEventListener('dragover', e => e.preventDefault(), false);
      // 没有打开过，则进入首页
      if (!this.opened) {
        this.$router.push('/login');
      }
      // 在外部浏览器中打开链接
      document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
          event.preventDefault();
          shell.openExternal(event.target.href);
        }
      });
    }
  };
</script>

<style lang='scss'>
  @import "./styles/common";

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    text-decoration: none;
  }

  body, html {
    width: 100%;
    height: 100%;
    font-size: 10px;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #303133;
    overflow: hidden;
  }

  #app {
    /*padding-top: 4rem;*/
    width: 100%;
    height: 100%;
    font-size: 1.6rem !important;
    color: #303133;
  }
</style>
