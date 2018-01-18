<template>
  <div id="root">
    <el-container>
      <el-aside id="aside">
        <Aside></Aside>
      </el-aside>
      <el-main id="main">
        <Main></Main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import Split from 'split.js';
  import Aside from './aside';
  import Main from './main';

  export default {
    name: 'index',
    mounted() {
      // split panel
      Split(['#aside', '#main'], {
        sizes: [25, 75],
        minSize: [150, 600],
        cursor: 'col-resize',
        gutterStyle() {
          return {
            width: '4px'
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
