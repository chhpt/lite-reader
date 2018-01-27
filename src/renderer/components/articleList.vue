<template>
  <div id="article-list">
    <el-container>
      <!--栏目-->
      <el-header height="60px">
        <el-tabs v-model="activeItem"
                 @tab-click="handleTabClick"
                 tab-position="bottom">
          <el-tab-pane v-for="item in menu" :label="item.title" :name="item.title" :url="item.url" :key="item.title" class="menu-item">
          </el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main>
        <!--文章列表-->
        <el-card v-for="article in articleList" :body-style="cardStyle" :key="article.id" class="article">
          <div class="article-info">
            <div class="article-title" @click="loadArticle(article.url)">
              {{article.title}}
            </div>
            <div class="article-intro">
              {{article.summary}}
            </div>
          </div>
          <div class="left">
            <div class="image-wrapper" v-if="article.image">
              <img :src="article.image" alt="文章图片" v-if="article.image">
            </div>
          </div>
        </el-card>
        <div class="load-more">
          <el-button plain :loading="false">
            加载更多
          </el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    name: 'articleList',
    data() {
      return {
        cardStyle: {
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
          padding: '15px'
        }
      };
    },
    computed: {
      activeItem: {
        get() {
          return this.$store.state.app.activeItem;
        },
        set(newValue) {
          this.setActiveItem(newValue);
        }
      },
      ...mapGetters([
        'menu',
        'name',
        'articleList'
      ])
    },
    methods: {
      handleTabClick(tab) {
        const url = this.menu[tab.index].url;
        const id = 0;
        this.setLoading(true);
        this.fetchArticleList({
          url,
          id,
          app: this.name,
          page: 1,
          column: this.activeItem
        }).then(() => {
          this.setLoading(false);
        });
      },
      loadArticle(url) {
        this.setLoading(true);
        this.fetchArticle({
          url,
          app: this.name
        }).then(() => {
          this.setLoading(false);
        }).catch(() => {
        });
        this.$router.replace('/reader');
      },
      ...mapMutations([
        'setLoading',
        'setActiveItem'
      ]),
      ...mapActions([
        'fetchArticleList',
        'fetchArticle'
      ])
    }
  };
</script>
<style lang="scss" scoped>
  #article-list,
  .el-container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .el-header {
    position: sticky;
    display: flex;
    justify-content: center;
    top: 0;
    width: 100%;
    background: #fff;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
  }

  .el-tabs {
    height: 6rem;
    max-width: 100%;
  }

  .article {
    width: 80%;
    min-width: 50rem;
    max-width: 80rem;
    margin: 2rem auto;
    .left {
      display: flex;
      align-items: center;
      margin-left: 3rem;
    }
    .image-wrapper {
      height: 11rem;
      width: 18rem;
    }
    img {
      height: 11rem;
      width: 18rem;
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
    .article-intro {
      margin: 1rem 0;
      font-size: 1.6rem;
      line-height: 2.5rem;
    }
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin: 4rem 0;
  }
</style>
