<template>
  <div id="c-aside">
    <div class="title">
      应用
    </div>
    <div class="line"></div>
    <div v-for="app in appList" class="app">
      <img :src="app.icon" alt="app">
      <span @click="getAppMenu(app.id, app.type)" class="app-name">{{app.name}}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    methods: {
      async getAppMenu(id, type) {
        this.setLoading(true);
        // 普通应用
        if (!type) {
          // 设置应用名称
          this.$store.commit('setAppName', id);
          // 获取栏目列表
          const menu = await this.fetchMenu(id);
          // 默认直接加载第一个栏目的文章
          const column = menu[0].title;
          this.setActiveItem(column);
          await this.fetchArticleList({
            column,
            app: id,
            page: 1,
            url: menu[0].url
          });
          this.setLoading(false);
        } else { // 微信公众号
          this.$store.commit('setAppName', 'weixin');
          this.fetchArticleList({
            app: 'weixin',
            page: 1,
            column: id
          }).then(() => {
            this.setLoading(false);
          });
        }
        this.$router.push('list');
      },
      ...mapMutations([
        'setActiveItem',
        'setLoading'
      ]),
      ...mapActions([
        'fetchMenu',
        'fetchArticleList'
      ])
    },
    computed: {
      ...mapGetters([
        'appList'
      ])
    },
  };
</script>

<style lang="scss" scoped>
  .title {
    font-size: 1.8rem;
    margin: 1rem 2rem;
    color: #606266;
  }

  .line {
    height: 1px;
    margin: 1rem 2rem;
    background-color: #bbb;
  }

  .app {
    display: flex;
    align-items: center;
    justify-items: center;
    height: 6rem;
    img {
      width: 4rem;
      height: 4rem;
      margin: 1rem 1rem 1rem 2rem;
    }
    .app-name {
      cursor: pointer;
    }
  }
</style>