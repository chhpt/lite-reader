<template>
  <div id="root">
    <el-container>
      <el-aside id="aside">
        <Aside></Aside>
      </el-aside>
      <el-main id="main"
               v-loading="loading"
               element-loading-text="拼命加载中">
        <Main></Main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Split from 'split.js';
  import Aside from './aside';
  import Main from './main';

  export default {
    name: 'index',
    computed: {
      ...mapGetters([
        'loading'
      ])
    },
    watch: {
      loading() {
      }
    },
    mounted() {
      // split panel
      Split(['#aside', '#main'], {
        sizes: [25, 75],
        minSize: [180, 600],
        cursor: 'col-resize',
        gutterStyle() {
          return {
            width: '2px'
          };
        }
      });
    },
    components: {
      Aside,
      Main
    }
  };
</script>

<style lang="scss">
  #root {
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  .el-aside {
    color: #000;
    border-right: 1px solid #ebeef5;
    box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.1);
  }

  .el-main {
    padding: 0;
  }

  .gutter {
    cursor: col-resize;
  }
</style>
