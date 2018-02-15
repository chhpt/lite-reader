<template>
  <div id="c-aside">
    <div class="app-wrapper">
      <div v-for="app in appList" class="app">
        <img :src="app.icon" @click="getAppMenu(app.id, app.type)" alt="图标">
        <span @click="getAppMenu(app.id, app.type)" class="app-name" v-if="!close">
          {{app.name}}
        </span>
      </div>
    </div>
    <div class="add-app">
      <i class="el-icon-plus icon" @click="loadAddWindow"></i>
      <i class="el-icon-d-arrow-left icon right" v-if="!close" @click="toggleSidebar"></i>
      <i class="el-icon-d-arrow-right icon" v-if="close" @click="toggleSidebar"></i>
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
        // 触发父组件的 sync 更新 prop 属性
        this.$emit('update:close', !this.close);
      },
      loadAddWindow() {
        this.$router.push('/addapp');
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
        this.$router.push('/list');
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
  #c-aside {
    height: 100%;
    /*padding-top: 2rem;*/
  }

  .app-wrapper {
    height: calc(100% - 4rem);
    overflow-y: scroll;
    border-bottom: 1px solid #ccc;
  }

  .app-wrapper::-webkit-scrollbar {
    background: transparent;
    width: 0.2rem;
  }

  .app-wrapper:hover::-webkit-scrollbar {
    background: #fff;
  }

  .app-wrapper:hover::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }

  .app-wrapper:hover::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
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

  .add-app {
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 1rem;
      cursor: pointer;
    }
  }
</style>