<template>
  <div id="root">
    <el-container>
      <el-aside :width="sideWidth">
        <Aside :close.sync="close"></Aside>
      </el-aside>
      <el-main v-loading="loading"
               element-loading-text="拼命加载中">
        <Main></Main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { ipcRenderer } from 'electron';
  import Aside from './layout/aside';
  import Main from './layout/main';

  export default {
    name: 'index',
    data() {
      return {
        close: true
      };
    },
    computed: {
      sideWidth() {
        return this.close ? '8rem' : '18rem';
      },
      ...mapGetters([
        'loading',
        'account'
      ])
    },
    mounted() {
      // 账户存在，获取用户的应用列表
      if (this.account.id) {
        this.fetchFollowAPPs().then((res) => {
          if (!res.status) {
            this.$message({
              type: 'error',
              message: res.error
            });
          }
        });
      }
      ipcRenderer.on('synchronous-data-main', (event, args) => {
        const { action, data } = args;
        if (action === 'send-account' && !this.account.id) {
          const { account } = data;
          this.setAccount(account);
        }
        // 获取关注的应用
        this.fetchFollowAPPs();
      });
    },
    methods: {
      ...mapMutations([
        'setAccount'
      ]),
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

<style lang="scss" scoped>
  #root {
    height: 100%;
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
      width: calc(100% - 8rem);
      padding: 0;
    }
  }
</style>
