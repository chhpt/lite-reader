<template>
  <div id="article-list">
    <el-container>
      <!--栏目-->
      <el-header height="60px">
        <el-tabs v-model="active"
                 @tab-click="handleTabClick"
                 tab-position="bottom">
          <el-tab-pane v-for="item in menu" :label="item.title" :name="item.title" :url="item.url" :key="item.title"
                       class="menu-item">
          </el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main>
        <!--文章列表-->
        <el-card v-for="article in articleList" :body-style="cardStyle" :key="article.id" class="article">
          <div class="article-info">
            <div class="article-title" @click="loadArticle(article)">
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
        <!--有文章时才显示加载更多-->
        <div class="load-more" v-if="articleList.length">
          <el-button plain :loading="loading" @click="loadMoreArticles">
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
        page: 1,
        active: undefined,
        cardStyle: {
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
          padding: '15px'
        },
        loading: false
      };
    },
    mounted() {
      this.active = this.activeItem.title;
    },
    watch: {
      activeItem(newValue) {
        this.active = newValue.title;
      }
    },
    computed: {
      ...mapGetters([
        'activeItem',
        'menu',
        'name',
        'articleList'
      ])
    },
    methods: {
      // 切换栏目
      handleTabClick(tab) {
        // 设置激活栏目
        this.active = this.activeItem.title;
        this.setActiveItem(this.menu[tab.index]);
        const url = this.menu[tab.index].url;
        // 文章 id
        const id = 0;
        this.setLoading(true);
        this.fetchArticleList({
          url, id, app: this.name, page: 1, column: this.activeItem.title
        }).then(() => {
          this.setLoading(false);
        });
      },
      // 加载文章
      loadArticle(article) {
        this.setLoading(true);
        this.fetchArticle({
          url: article.url,
          app: this.name,
          id: article.id,
          category: article.category
        }).then(() => {
          this.setLoading(false);
        }).catch(() => {
        });
        this.$router.replace('/reader');
      },
      // 加载更多文章
      loadMoreArticles() {
        this.loading = true;
        // 最后一篇文章的 id
        const id = this.articleList[this.articleList.length - 1].id;
        this.page = this.page + 1;
        this.fetchMoreArticles({
          id,
          app: this.name,
          column: this.activeItem.title,
          page: this.page,
          url: this.activeItem.url
        }).then(() => {
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      ...mapMutations([
        'setLoading',
        'setActiveItem'
      ]),
      ...mapActions([
        'fetchArticleList',
        'fetchMoreArticles',
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
    /*窗口拖拽*/
    -webkitapp-region: drag;
  }

  .el-tabs {
    height: 6rem;
    max-width: 100%;
    /*窗口拖拽*/
    -webkitapp-region: drag;
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
      max-height: 11rem;
      max-width: 18rem;
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
