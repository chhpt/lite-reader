<template>
  <div id="list">
    <!--列表-->
    <el-card v-for="article in articleList" :body-style="cardStyle" :key="article.id" class="article">
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
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import ScrollReveal from 'scrollreveal';

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
    computed: {
      ...mapGetters([
        'menu',
        'currentApp',
        'articleList',
        'activeItem'
      ])
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
      // 加载文章
      async loadArticle(article) {
        this.setLoading(true);
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
            this.setLoading(false);
            throw new Error(err);
          }
        }
        this.setLoading(false);
        this.$router.replace('/reader');
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
    text-align: justify;
    .article-title {
      font-size: 2.2rem;
      font-weight: 500;
      line-height: 3.6rem;
      cursor: pointer;
    }
    .article-summary {
      margin: 1rem 0;
      font-size: 1.6rem;
      line-height: 2.5rem;
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
