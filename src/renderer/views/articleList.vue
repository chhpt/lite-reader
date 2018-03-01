<template>
  <div id="article-list">
    <el-container class="is-vertical">
      <!--栏目-->
      <Header :backIcon="false" :menu="menu" @handleTabClick="handleTabClick"></Header>
      <el-main id="articles">
        <List></List>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import Header from '../components/header';
  import List from '../components/list';

  export default {
    name: 'list',
    data() {
      return {
        page: 1,
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
        'activeItem'
      ])
    },
    methods: {
      // 切换栏目
      async handleTabClick(tab) {
        this.setLoading(true);
        this.setActiveItem(this.menu[tab.index]);
        const { type, appId, remoteid } = this.currentApp;
        const { name } = this.activeItem;
        try {
          await this.fetchArticleList({
            type,
            appId,
            column: type ? name : remoteid
          });
        } catch (err) {
          this.setLoading(false);
          throw new Error(err);
        }
        this.setLoading(false);
      },
      ...mapMutations([
        'setLoading',
        'setActiveItem'
      ]),
      ...mapActions([
        'fetchArticleList'
      ])
    },
    components: {
      Header,
      List
    }
  };
</script>
<style lang="scss" scoped>
  #article-list,
  .el-container {
    height: 100%;
    width: 100%;
  }

  #article-list .el-main {
    height: calc(100% - 50px);
  }
</style>
