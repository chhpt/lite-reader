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
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Header from './header';
  import Icon from './Icon';
  import Utils from '../utils';

  export default {
    name: 'reader',
    data() {
      return {
        collected: false
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
      ...mapGetters([
        'article',
        'routeHistory'
      ])
    },
    methods: {
      back() {
        const path = this.routeHistory.pop();
        this.$router.push(path);
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
      ...mapActions([
        'collectArticle',
        'cancelCollectArticle',
        'fetchCollectArticles'
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
</style>