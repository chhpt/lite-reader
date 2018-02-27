<template>
  <div id="c-aside">
    <div class="app-wrapper">
      <div v-for="app in followAPPs" class="app">
        <img :src="app.imageURL" @click="getAppMenu(app)" alt="图标">
        <span @click="getAppMenu(app)" class="app-name" v-if="!close">
          {{app.title}}
        </span>
      </div>
      <div v-if="!followAPPs.length" class="no-apps-waring">
        <el-popover
            placement="top"
            width="180"
            trigger="hover"
            content="你还没有关注的应用，点击下方加号关注你的应用！">
          <span slot="reference">
            ~空空如野~
          </span>
        </el-popover>
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
  import { ipcRenderer } from 'electron';

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapGetters([
        'followAPPs'
      ])
    },
    props: {
      close: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      ipcRenderer.on('synchronous-data-main', (event, args) => {
        const { action, data } = args;
        if (action === 'send-follow-apps') {
          const { apps } = data;
          this.setFollowAPPs(apps);
        }
      });
    },
    methods: {
      toggleSidebar() {
        // 触发父组件的 sync 更新 prop 属性
        this.$emit('update:close', !this.close);
      },
      loadAddWindow() {
        this.$router.push('/addapp');
      },
      async getAppMenu(app) {
        const { type, appId, remoteid } = app;
        this.setLoading(true);
        // 设置应用名称
        this.setCurrentApp(app);
        // 获取栏目列表
        const menu = await this.fetchMenu({
          appId,
          type
        });
        // 默认直接加载第一个栏目的文章
        this.setActiveItem(menu[0]);
        await this.fetchArticleList({
          type,
          appId,
          column: type ? menu[0].name : remoteid,
          id: 0
        });
        this.setLoading(false);
        this.$router.push('/list');
      },
      ...mapMutations([
        'setCurrentApp',
        'setActiveItem',
        'setLoading',
        'setMenu',
        'setFollowAPPs'
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
  }

  .app-wrapper {
    height: calc(100% - 4rem);
    overflow-y: scroll;
    border-bottom: 1px solid #ccc;
    .no-apps-waring {
      margin: 4rem 2rem;
      text-align: center;
      line-height: 3rem;
      color: #6f7180;
      span {
        cursor: pointer;
      }
    }
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