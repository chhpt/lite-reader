<template>
  <div id="app-detail">
    <div class="app-detail-inner">
      <div class="app">
        <img :src="app.imageURL" alt="图片">
        <div class="app-info">
          <div class="app-name">
            {{app.title}}
          </div>
          <div class="app-description">
            {{app.description}}
          </div>
        </div>
      </div>
      <div class="article-list"
           v-loading="loading"
           element-loading-text="精彩内容马上来到...">
        <div class="article" v-for="article in appArticleList">
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
      </div>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  export default {
    name: 'app-detail',
    data() {
      return {
        loading: true
      };
    },
    computed: {
      ...mapGetters([
        'appArticleList',
        'app'
      ])
    },
    created() {
      if (this.appArticleList.length) {
        this.loading = false;
        return;
      }
      ipcRenderer.on('app-detail', (event, app) => {
        this.setApp(app);
        this.fetchAppArticleList({
          section: this.app.remoteid
        }).then(() => {
          this.loading = false;
        });
      });
    },
    filters: {
      formatTime(v) {
        const current = new Date();
        const republic = new Date(v * 1000);
        const year = republic.getFullYear();
        const day = republic.getDate() < 10 ? `0${republic.getDate()}` : republic.getDate();
        const month = republic.getMonth() + 1 < 10 ? `0${republic.getMonth() + 1}` : republic.getMonth() + 1;
        const hour = republic.getHours() < 10 ? `0${republic.getHours()}` : republic.getHours();
        const minute = republic.getMinutes() < 10 ? `0${republic.getMinutes()}` : republic.getMinutes();
        if (current.getFullYear() === republic.getFullYear()) {
          return `${month}-${day} ${hour}:${minute}`;
        }
        return `${year}-${month}-${day} ${hour}:${minute}`;
      }
    },
    methods: {
      loadArticle(article) {
        const { url, section, hasRss } = article;
        this.fetchAppArticle({
          url, section, hasRss
        }).then(() => {
          this.$router.push('/app_reader');
        });
      },
      ...mapMutations([
        'setApp'
      ]),
      ...mapActions([
        'fetchAppArticleList',
        'fetchAppArticle'
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
      margin-left: 2rem;
      .app-name {
        font-size: 2rem;
        font-weight: 500;
      }
      .app-description {
        margin-top: 1rem;
      }
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
        overflow-y: hidden;
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
</style>