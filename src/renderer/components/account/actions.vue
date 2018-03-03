<template>
  <div id="account-actions">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="收藏" name="collection"></el-tab-pane>
      <el-tab-pane label="浏览历史" name="history"></el-tab-pane>
      <el-tab-pane label="关注应用" name="follow"></el-tab-pane>
    </el-tabs>
    <!--展示列表-->
    <div class="list">
      <el-card class="card" v-for="(item, index) in list" :key="index" :body-style="{padding: '1rem'}">
        <div class="item">
          <img :src="item.imageURL" alt="图标" v-if="activeName === 'follow'">
          <div class="item-info">
            <!--文章来源应用-->
            <div class="article-info" v-if="activeName === 'collection'">
              <i class="el-icon-info"></i>
              {{item.appName}}
              <span>
                  {{item.time | formatTime}}
                </span>
            </div>
            <div class="title" @click="handleTitleClick(item)" :class="{link: activeName==='collection'}">
              {{item.title}}
            </div>
            <div class="description">
              {{item.description}}
            </div>
          </div>
          <div class="item-action">
            <el-button type="text"
                       @click="handleCancelCollectArticle(item)"
                       v-if="activeName === 'collection'">
              取消收藏
            </el-button>
            <el-button type="text"
                       @click="handleCancelFollow(item)"
                       v-if="activeName === 'follow'">
              取消关注
            </el-button>
          </div>
        </div>
      </el-card>
      <el-card v-if="!list.length" class="card">
        暂时没有数据
      </el-card>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { ipcRenderer } from 'electron';
  import Utils from '../../utils/index';

  export default {
    name: 'account-actions',
    data() {
      return {
        activeName: 'collection',
        list: []
      };
    },
    computed: {
      ...mapGetters([
        'followAPPs',
        'account',
        'collectArticles'
      ])
    },
    filters: {
      formatTime: Utils.formatTime
    },
    mounted() {
      this.getCollection();
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
      handleTitleClick(item) {
        // 打开链接
        if (item.url) {
          const link = document.createElement('a');
          link.href = item.url;
          document.querySelector('body').appendChild(link);
          link.click();
        }
      },
      handleClick(tab) {
        const { index } = tab;
        this.list = [];
        switch (index) {
          case '0':
            this.getCollection();
            break;
          case '1':
            this.getBrowserHistory();
            break;
          case '2':
            this.getFollowApps();
            break;
          default:
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
          const { apps } = res;
          this.list = apps;
          // 同步主进程状态
          this.sendFollowAPPs(apps);
        } else {
          this.$message({
            type: 'error',
            message: res.error
          });
        }
      },
      getCollection() {
        // 获取收藏的文章
        if (this.collectArticles.length) {
          this.list = this.collectArticles;
        } else {
          this.fetchCollectArticles().then((res) => {
            if (res.status) {
              this.list = this.collectArticles;
            } else {
              this.$message({
                type: 'error',
                message: res.error
              });
            }
          });
        }
      },
      // 取消收藏文章
      handleCancelCollectArticle(item) {
        this.cancelCollectArticle({
          article: item
        }).then((res) => {
          if (res.status) {
            this.$message('取消收藏成功');
            this.list = this.collectArticles;
          } else {
            this.$message({
              type: 'error',
              message: res.error
            });
          }
        });
      },
      getBrowserHistory() {
      },
      getFollowApps() {
        // 获取关注的应用
        if (this.followAPPs.length) {
          this.list = this.followAPPs;
        } else {
          this.fetchFollowAPPs().then((res) => {
            if (res.status) {
              this.list = res.apps;
            }
            this.sendFollowAPPs(res.apps);
          });
        }
      },
      ...mapActions([
        'cancelUserFollowAPP',
        'fetchFollowAPPs',
        'fetchCollectArticles',
        'cancelCollectArticle'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/common";

  #account-actions {
    height: calc(100% - 10rem);
    padding: 0 2rem;
    .el-tabs {
      margin: 0 3rem;
      height: 5rem;
    }
  }

  .list {
    height: calc(100% - 5rem);
    overflow: scroll;
    @include normalScrollbar;
    .card {
      margin: 1rem 3rem;
      img {
        width: 5rem;
        height: 5rem;
        border-radius: 1.25rem;
      }
      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .item-info {
        margin-left: 2rem;
        flex: 1 1 auto;
      }
      .article-info {
        margin: 1rem 0;
        span {
          float: right;
        }
      }
      .title {
        font-size: 1.8rem;
        font-weight: 500;
        &.link {
          font-size: 1.6rem;
          color: #556D88;
          cursor: pointer;
        }
      }
      .description {
        margin-top: 0.8rem;
      }
      .item-action {
        display: flex;
        align-items: center;
        margin-left: 4rem;
      }
    }
  }
</style>