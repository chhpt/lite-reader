<template>
  <div id="app-detail">
    <div class="app-detail-inner">
      <div class="app">
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
      </div>
      <div class="article-list"
           v-loading="loading"
           element-loading-text="精彩内容马上来到...">
        <el-card v-for="article in list" :body-style="cardStyle" :key="article.id" class="article">
          <div class="article-info">
            <div class="article-title" @click="loadArticle(article)">
              {{article.title}}
            </div>
            <div class="article-intro">
              {{article.summary}}
            </div>
          </div>
          <div class="right">
            <div class="image-wrapper" v-if="article.image">
              <img :src="article.image" alt="文章图片" v-if="article.image">
            </div>
          </div>
        </el-card>
        <div class="article" v-for="article in list">
          <div class="article-info">
            <div class="article-title" @click="loadArticle(article)">
              {{article.title}}
            </div>
            <div class="article-summary" v-html="article.summary">
            </div>
            <div class="time">
              {{article.time | formatTime}}
            </div>
          </div>
          <div class="image-wrapper" v-if="article.image">
            <img :src="article.image" alt="图片">
          </div>
        </div>
        <!--有文章时才显示加载更多-->
        <div class="load-more" v-if="list.length">
          <el-button plain :loading="loadingMore" @click="loadMoreArticles">
            加载更多
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import db from '../../../dataStore';

  export default {
    name: 'app-detail',
    data() {
      return {
        loading: true,
        loadingMore: false,
        page: 1
      };
    },
    computed: {
      ...mapGetters([
        'list',
        'currentApp',
        'account',
        'activeItem'
      ])
    },
    created() {
      if (this.list.length) {
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
    filters: {
      formatTime(time) {
        // 文字
        if (Number(time) !== Number(time)) {
          return time;
        }
        const now = Date.now();
        const past = parseInt(now / 1000, 10) - time;
        switch (true) {
          case past < 3600: {
            const t = parseInt(past / 60, 10);
            return `${t !== 0 ? t : t + 1} 分钟前`;
          }
          case past < 86400: {
            const t = parseInt(past / 3600, 10);
            return `${t !== 0 ? t : t + 1} 小时前`;
          }
          default: {
            const t = parseInt(past / 86400, 10);
            return `${t !== 0 ? t : t + 1} 天前`;
          }
        }
        // const current = new Date();
        // const republic = new Date(v * 1000);
        // const year = republic.getFullYear();
        // const day = republic.getDate() < 10 ? `0${republic.getDate()}` : republic.getDate();
        // const month = republic.getMonth() + 1 < 10 ?
        // `0${republic.getMonth() + 1}` : republic.getMonth() + 1;
        // const hour = republic.getHours() < 10 ? `0${republic.getHours()}` : republic.getHours();
        // const minute = republic.getMinutes() < 10 ?
        // `0${republic.getMinutes()}` : republic.getMinutes();
        // if (current.getFullYear() === republic.getFullYear()) {
        //   return `${month}-${day} ${hour}:${minute}`;
        // }
        // return `${year}-${month}-${day} ${hour}:${minute}`;
      }
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
      // 点击文章加载文章内容
      async loadArticle(article) {
        this.loading = true;
        const { type, appId } = this.currentApp;
        // 文章内容是否已经存在
        if (article.content) {
          this.setArticle(article);
        } else {
          try {
            await this.fetchArticle({
              type,
              appId,
              article
            });
          } catch (err) {
            this.loading = false;
            throw new Error(err);
          }
        }
        this.loading = false;
        this.$router.push('/app_reader');
      },
      // 加载更多文章
      async loadMoreArticles() {
        this.loadingMore = true;
        // 最后一篇文章的 id
        this.page = this.page + 1;
        const { id } = this.list[this.list.length - 1];
        const { type, appId, remoteid } = this.currentApp;
        const { name } = this.activeItem;
        try {
          await this.fetchMoreArticles({
            type,
            appId,
            id,
            column: type ? name : remoteid,
            page: this.page
          });
        } catch (err) {
          this.loadingMore = false;
          throw new Error(err);
        }
        this.loadingMore = false;
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
        'setCurrentApp',
        'setArticle'
      ]),
      ...mapActions([
        'fetchArticleList',
        'fetchArticle',
        'userFollowAPP',
        'cancelUserFollowAPP'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  #app-detail {
    padding-top: 4rem;
    height: 100%;
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      background: #fff;
      width: 0.4rem;
    }

    &:hover::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px #fff;
    }

    &:hover::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px #6f7180;
      border-radius: 0.2rem;
    }
  }

  .app {
    width: 80%;
    margin: 2rem auto;
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
    width: 80%;
    margin: 0 auto;
    padding: 2rem 0;
    .article {
      display: flex;
      justify-content: space-between;
      min-width: 50rem;
      max-width: 80rem;
      margin: 3rem auto;
      padding: 2rem;
      box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
      border: 1px solid #f0f0f0;
      .article-info {
        width: calc(100% - 21rem);
      }
      .article-title {
        font-size: 2.5rem;
        font-weight: 500;
        cursor: pointer;
        color: #303133;
      }
      .article-summary {
        margin-top: 1.5rem;
        max-height: 18rem;
        overflow: hidden;
        line-height: 3rem;
        color: #606266;
      }
      .time {
        margin-top: 1.5rem;
        color: #606266;
      }
      .image-wrapper {
        display: flex;
        align-items: center;
        width: 18rem;
        margin-left: 3rem;
      }
      img {
        width: 18rem;
      }
    }
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin: 4rem 0;
  }
</style>