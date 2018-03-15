<template>
  <div id="reader">
    <el-container class="is-vertical">
      <Header :backIcon="true"
              height="40px"
              :source="true"
              :collected="collected"
              @back="back"
              @openSource="handleOpenSource"
              @collect="handleCollectArticle"
              @cancelCollect="handleCancelCollectArticle"></Header>
      <el-main>
        <div class="article">
          <div class="article-title">
            {{article.title}}
          </div>
          <div class="publish-time">
            <Icon name="shijiansvg" font-size="2.5rem"></Icon>
            <span>
              {{article.time | formatTime}}
            </span>
          </div>
          <div class="article-content" v-html="article.content">
          </div>
          <div class="ending" v-if="article.title">
            --------- END ---------
          </div>
          <div class="change-page" v-if="article.title">
            <div class="prev" v-if="prev">
              <div @click="loadArticle(prev)">
                上一篇：
                {{prev&&prev.title}}
              </div>
            </div>
            <div class="next" v-if="next">
              <div  @click="loadArticle(next)">
                下一篇：
                {{next&&next.title}}
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import Header from './header';
  import Icon from './Icon';
  import Utils from '../utils';

  export default {
    name: 'reader',
    data() {
      return {
        collected: false,
        page: 0,
      };
    },
    filters: {
      formatTime: Utils.formatTime
    },
    mounted() {
      this.fetchCollectArticles().then((res) => {
        if (res.status) {
          const exit = res.articles.find((e) => e.title === this.article.title);
          if (exit) {
            this.collected = true;
          }
        }
      });
    },
    computed: {
      // 上一篇文章
      prev() {
        const index = this.articleList.findIndex(e => e.title === this.article.title);
        if (index <= 0) {
          return null;
        }
        return this.articleList[index - 1];
      },
      // 下一篇文章
      next() {
        const index = this.articleList.findIndex(e => e.title === this.article.title);
        // 最后一篇文章，自动加载下一个列表
        if (index === this.articleList.length - 1) {
          this.loadMoreArticles();
        }
        return this.articleList[index + 1];
      },
      ...mapGetters([
        'article',
        'routeHistory',
        'articleList',
        'currentApp',
        'activeItem'
      ])
    },
    methods: {
      back() {
        const path = this.routeHistory.pop();
        this.$router.push(path);
      },
      async loadArticle(article) {
        this.setLoading(true);
        const { type, appId } = this.currentApp;
        try {
          const res = await this.fetchArticle({
            type,
            appId,
            article
          });
          if (res.status) {
            this.setLoading(false);
          } else {
            // 服务端提示错误
            this.setLoading(false);
            this.$message(res.error);
          }
        } catch (err) {
          // 其他错误
          this.setLoading(false);
          throw new Error(err);
        }
      },
      async loadMoreArticles() {
        this.page = this.page + 1;
        // 最后一篇文章的 id
        const id = this.articleList[this.articleList.length - 1].id;
        const { type, appId, remoteid } = this.currentApp;
        let name;
        if (this.activeItem && this.activeItem.name) {
          name = this.activeItem.name;
        } else {
          name = 'home';
        }
        try {
          await this.fetchMoreArticles({
            type,
            appId,
            id,
            column: type ? name : remoteid,
            page: this.page
          });
        } catch (err) {
          this.loading = false;
          throw new Error(err);
        }
        this.loading = false;
      },
      handleOpenSource() {
        const { url } = this.article;
        const link = document.createElement('a');
        link.href = url;
        document.querySelector('body').appendChild(link);
        link.click();
      },
      async handleCollectArticle() {
        const res = await this.collectArticle({
          article: this.article
        });
        if (res.status) {
          this.$message('收藏文章成功，在个人设置中查看收藏文章');
          this.collected = true;
        } else {
          this.$message({
            type: 'error',
            error: res.error
          });
        }
      },
      async handleCancelCollectArticle() {
        const res = await this.cancelCollectArticle({
          article: this.article
        });
        if (res.status) {
          this.$message('取消收藏文章成功');
          this.collected = false;
        } else {
          this.$message({
            type: 'error',
            error: res.error
          });
        }
      },
      ...mapMutations(['setLoading']),
      ...mapActions([
        'collectArticle',
        'cancelCollectArticle',
        'fetchCollectArticles',
        'fetchMoreArticles',
        'fetchArticle'
      ])
    },
    components: {
      Header,
      Icon
    }
  };
</script>

<style lang="scss" scoped>
  @import '../styles/reader.css';

  #reader {
    height: 100%;
    overflow: hidden;
  }

  .el-container {
    height: 100%;
    line-height: 3.5rem;
  }

  .el-main {
    height: calc(100% - 5rem);
    overflow-x: hidden;
    &::-webkit-scrollbar {
      background: transparent;
      width: 0.4rem;
    }
    &:hover::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    }

    &:hover::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px #6f7180;
      border-radius: 0.2rem;
    }
  }

  .article {
    width: 80%;
    margin: 4rem auto;
    text-align: justify;
    font-weight: 400;
    .article-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 3rem 0;
    }
    .publish-time {
      margin: 2rem 0;
      font-size: 2rem;
      display: flex;
      align-items: center;
      span {
        margin-left: 1rem;
      }
    }

    .ending {
      margin: 2rem 0;
      display: flex;
      justify-content: center;
    }
  }

  .change-page {
    margin-top: 3rem;
    .prev,
    .next {
      margin: 2rem 0;
      color: #556D88;
      text-decoration: underline;
      cursor: pointer;
    }
  }
</style>