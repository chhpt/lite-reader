<template>
  <el-container id="app-detail">
    <div class="drag-area"></div>
    <el-header class="app">
      <img :src="currentApp.imageURL" alt="图片">
      <div class="app-info">
        <div class="app-name">
          {{currentApp.title}}
        </div>
        <div class="app-description">
          {{currentApp.description}}
        </div>
      </div>
      <div class="follow">
        <el-button size="small" @click="handleFollowAPP(currentApp)" v-if="!currentApp.followed">关注</el-button>
        <el-button size="small" @click="handleCancelFollow(currentApp)" type="primary" icon="el-icon-check"
                   v-if="currentApp.followed">取消关注
        </el-button>
      </div>
    </el-header>
    <AnimateDot :loading="loading" class="loading-animation"></AnimateDot>
    <el-main class="article-list">
      <List articlePath="/app_reader"></List>
    </el-main>
  </el-container>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import List from '../../components/list';
  import AnimateDot from '../../components/animatedot';
  import db from '../../../dataStore';

  export default {
    name: 'app-detail',
    data() {
      return {
        loading: true,
        loadingMore: false
      };
    },
    computed: {
      ...mapGetters([
        'articleList',
        'currentApp',
        'account'
      ])
    },
    created() {
      if (this.articleList.length) {
        this.loading = false;
        return;
      }
      ipcRenderer.on('app-detail', (event, app) => {
        this.setCurrentApp(app);
        const { type, appId, remoteid } = this.currentApp;
        // 获取
        this.fetchArticleList({
          type,
          appId,
          column: type ? 'home' : remoteid
        }).then(() => {
          this.loading = false;
        });
        // 从本地读取关注应用的数据（从搜索框直接选择 APP 可能会导致 APP 的关注状态有误）
        const followApps = db.get('user.follows').value();
        const exit = followApps.find((e) => e.title === app.title);
        this.currentApp.followed = Boolean(exit);
      });
    },
    methods: {
      // 向主进程同步关注应用
      sendFollowAPPs(apps) {
        ipcRenderer.send('synchronous-data-main', {
          action: 'send-follow-apps',
          data: {
            apps
          }
        });
      },
      async handleFollowAPP(app) {
        // 没有登录，不能关注应用
        if (!this.account.id) {
          this.$message({
            message: '你尚未登录，不能进行操作',
            type: 'error'
          });
          return;
        }
        // 关注应用
        const res = await this.userFollowAPP({ app });
        if (res.status) {
          this.$message('关注成功');
          this.currentApp.followed = true;
          this.sendFollowAPPs(res.apps);
        } else {
          this.$message({
            message: res.error,
            type: 'error'
          });
        }
      },
      async handleCancelFollow(app) {
        // 没有登录，不能取消关注应用
        if (!this.account.id) {
          this.$message({
            message: '你尚未登录，不能进行操作',
            type: 'error'
          });
          return;
        }
        // 取消关注
        const res = await this.cancelUserFollowAPP({ app });
        if (res.status) {
          this.$message('取消关注成功');
          this.currentApp.followed = false;
          this.sendFollowAPPs(res.apps);
        } else {
          this.$message({
            type: 'error',
            message: res.error
          });
        }
      },
      ...mapMutations([
        'setCurrentApp'
      ]),
      ...mapActions([
        'fetchArticleList',
        'userFollowAPP',
        'cancelUserFollowAPP'
      ])
    },
    components: {
      List,
      AnimateDot
    }
  };
</script>

<style lang="scss" scoped>
  #app-detail {
    height: 100%;
    width: 100%;
    overflow: auto;
    .drag-area {
      width: 100%;
      height: 3rem;
      /*窗口拖拽*/
      -webkit-app-region: drag;
    }
  }

  .app {
    width: 80%;
    margin: 2rem auto;
    height: 10rem;
    display: flex;
    align-items: flex-start;
    img {
      width: 6rem;
      height: 6rem;
      border-radius: 1.5rem;
    }
    .app-info {
      flex: 1 1 auto;
      margin-left: 2rem;
      .app-name {
        font-size: 2rem;
        font-weight: 500;
      }
      .app-description {
        margin-top: 1rem;
      }
    }
    .follow {
      align-self: center;
    }
  }

  .article-list {
    height: calc(100% - 17rem);
  }
</style>