<template>
  <div id="list">
    <div class="list-inner">
      <!--列表-->
      <el-card v-for="(article) in articleList" :body-style="cardStyle" :key="article.id" class="article">
        <div class="article-info">
          <div class="article-title" @click="loadArticle(article)">
            {{article.title}}
          </div>
          <div class="article-summary">
            {{article.summary}}
          </div>
          <div class="time">
            {{article.time | formatTime}}
          </div>
        </div>
        <div class="right">
          <div class="image-wrapper" v-if="article.image">
            <img :src="article.image" alt="文章图片" v-if="article.image">
          </div>
        </div>
      </el-card>
      <!--有文章时才显示加载更多-->
      <div class="load-more" v-if="articleList.length">
        <el-button plain :loading="loading" @click="loadMoreArticles">
          加载更多
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import ScrollReveal from 'scrollreveal';
  import Utils from '../utils';

  export default {
    name: 'list',
    data() {
      return {
        page: 1,
        scrollReveal: new ScrollReveal({ reset: true }),
        cardStyle: {
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
          padding: '15px',
        },
        loading: false
      };
    },
    props: {
      articlePath: {
        type: String,
        required: true,
        default: ''
      }
    },
    computed: {
      ...mapGetters([
        'menu',
        'currentApp',
        'articleList',
        'activeItem'
      ])
    },
    mounted() {
      // 保留滚动位置
      document.querySelector('#list').scrollTop = this.$route.meta.position;
      // 组件重新挂载（从 reader 到 list）
      if (this.articleList.length) {
        this.$nextTick(() => {
          const container = document.querySelector('#list');
          this.scrollReveal.reveal('.article', {
            container,
            duration: 500
          });
        });
      }
    },
    watch: {
      articleList(v) {
        if (v.length) {
          this.$nextTick(() => {
            const container = document.querySelector('#list');
            this.scrollReveal.reveal('.article', {
              container,
              duration: 500
            });
          });
        }
      }
    },
    filters: {
      formatTime: Utils.formatTime
    },
    methods: {
      // 加载文章
      async loadArticle(article) {
        // 在路由元中记录滚动位置，便于下次恢复位置
        this.$route.meta.position = document.querySelector('#list').scrollTop;
        this.setLoading(true);
        const { type, appId } = this.currentApp;
        // 文章内容是否已经存在
        if (article.content) {
          this.setArticle(article);
          this.setLoading(false);
          this.$router.push(this.articlePath);
          return 1;
        }
        // 获取文章
        try {
          const res = await this.fetchArticle({
            type,
            appId,
            article
          });
          if (res.status) {
            this.setLoading(false);
            this.$router.push(this.articlePath);
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
        return 1;
      },
      // 加载更多文章
      async loadMoreArticles() {
        this.loading = true;
        this.page = this.page + 1;
        // 最后一篇文章的 id
        const id = this.articleList[this.articleList.length - 1].id;
        const { type, appId, remoteid } = this.currentApp;
        let name;
        if (this.activeItem && this.activeItem.name) {
          name = this.activeItem.name;
        } else if (this.menu.length) {
          name = this.menu[0].name;
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
      ...mapMutations([
        'setLoading',
        'setArticle',
        'setActiveItem'
      ]),
      ...mapActions([
        'fetchMoreArticles',
        'fetchArticle'
      ])
    }
  };
</script>
<style lang="scss" scoped>
  #list {
    height: 100%;
    width: 100%;
    overflow: auto;
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
    min-width: 50rem;
    max-width: 80rem;
    margin: 2rem auto;
    .right {
      display: flex;
      align-items: center;
      margin-left: 3rem;
    }
    .image-wrapper {
      width: 18rem;
      img {
        max-width: 18rem;
      }
    }
  }

  .article-info {
    height: 100%;
    max-width: 100%;
    text-align: justify;
    .article-title {
      font-size: 2.2rem;
      font-weight: 500;
      line-height: 3.6rem;
      cursor: pointer;
    }

    .article-summary {
      margin: 1rem 0;
      max-width: 100%;
      font-size: 1.6rem;
      line-height: 2.5rem;
      // 过长的英文单词超过宽度
      word-wrap: break-word;
      word-break: normal;
    }

    .time {
      margin-top: 1.5rem;
      color: #606266;
    }
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin: 4rem 0;
  }
</style>
