<template>
  <div id="c-aside">
    <div class="close">
      <i class="el-icon-d-arrow-left icon" v-if="!close" @click="toggleSidebar"></i>
      <div class="closed" v-if="close" @click="toggleSidebar"></div>
    </div>
    <div class="app-wrapper">
      <div v-for="app in appList" class="app">
        <img :src="app.icon" @click="getAppMenu(app.id, app.type)" alt="图标">
        <span @click="getAppMenu(app.id, app.type)" class="app-name" v-if="!close">
          {{app.name}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapGetters([
        'appList'
      ])
    },
    props: {
      close: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      toggleSidebar() {
        this.$bus.$emit('toggle-sidebar');
      },
      async getAppMenu(id, type) {
        this.setLoading(true);
        // 普通应用
        if (!type) {
          // 设置应用名称
          this.$store.commit('setAppName', id);
          // 获取栏目列表
          const menu = await this.fetchMenu(id);
          // 默认直接加载第一个栏目的文章
          this.setActiveItem(menu[0]);
          await this.fetchArticleList({
            app: id,
            page: 1,
            url: menu[0].url,
            column: menu[0].title
          });
          this.setLoading(false);
        } else { // 微信公众号
          this.$store.commit('setAppName', 'weixin');
          this.setMenu([]);
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
        'setLoading',
        'setMenu'
      ]),
      ...mapActions([
        'fetchMenu',
        'fetchArticleList'
      ])
    },
  };
</script>

<style lang="scss" scoped>
  .close {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 4rem;
    padding-top: 2rem;
    .icon {
      float: right;
      font-size: 2rem;
      margin-right: 1rem;
      cursor: pointer;
    }
    .closed {
      float: right;
      width: 1rem;
      height: 1rem;
      margin-right: 1rem;
      background: #657b83;
      border-radius: 0.5rem;
    }
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
      border-radius: 1rem;
      cursor: pointer;
    }
    .app-name {
      cursor: pointer;
    }
  }
</style>