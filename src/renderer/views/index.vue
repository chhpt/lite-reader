<template>
  <div id="root">
    <el-container>
      <el-aside id="aside" :style="sidebarStyle">
        <Aside :close.sync="close" @update:close="toggleSidebar"></Aside>
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
  import { mapGetters, mapActions } from 'vuex';
  import Split from 'split.js';
  import Aside from './layout/aside';
  import Main from './layout/main';
  import db from '../../dataStore';

  export default {
    name: 'index',
    data() {
      return {
        close: false,
        sidebarStyle: {
          width: '18rem'
        }
      };
    },
    computed: {
      ...mapGetters([
        'loading'
      ])
    },
    mounted() {
      // split panel
      Split(['#aside', '#main'], {
        sizes: [25, 75],
        minSize: [80, 600],
        cursor: 'col-resize',
        gutterStyle() {
          return {
            width: '2px'
          };
        },
        onDrag: () => {
          const width = document.querySelector('#c-aside').clientWidth;
          this.close = width < 180;
        }
      });
      // 账户存在，获取用户的应用列表
      const account = db.get('user.account').value();
      if (account) {
        this.fetchFollowAPPs().then((res) => {
          if (res.status) {
            const { apps } = res;
            db.set('user.follows', apps).write();
          } else {
            this.$message({
              type: 'error',
              message: res.error
            });
          }
        });
      } else {
        // 清空关注应用信息
        db.set('user.follows', []).write();
      }
    },
    methods: {
      toggleSidebar() {
        this.sidebarStyle.width = this.close ? '8rem' : '18rem';
      },
      ...mapActions([
        'fetchFollowAPPs'
      ])
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
    height: 100%;
    color: #000;
    border-right: 1px solid #ebeef5;
    box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.1);
  }

  .el-main {
    height: 100%;
    padding: 0;
  }

  .gutter {
    cursor: col-resize;
  }
</style>
