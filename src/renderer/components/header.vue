<template>
  <el-header :height="height" id="c-header">
    <div class="icons" v-if="backIcon">
      <i class="el-icon-arrow-left" @click="backAction"></i>
      <i class="el-icon-star-off" @click="collectAction" v-if="!collected"></i>
      <i class="el-icon-star-on" @click="cancelCollectAction" v-if="collected"></i>
    </div>
    <el-tabs :value="active"
             @tab-click="tabClickAction"
             tab-position="bottom"
             class="header-tab">
      <el-tab-pane v-for="item in menu" :label="item.title" :name="item.title" :url="item.url" :key="item.title"
                   class="menu-item">
      </el-tab-pane>
    </el-tabs>
    <el-button type="text"
               class="el-icon-more open-source"
               @click="openSourceAction"
               v-if="source">
    </el-button>
  </el-header>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'c-header',
    data() {
      return {
      };
    },
    props: {
      backIcon: {
        type: Boolean,
        default: false
      },
      menu: {
        type: Array,
        default() {
          return [];
        }
      },
      height: {
        type: String,
        default: '50px'
      },
      source: {
        type: Boolean,
        default: false
      },
      collected: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      active() {
        let title = '';
        if (this.activeItem.title) {
          title = this.activeItem.title;
        } else if (this.menu.length) {
          title = this.menu[0].title;
        }
        return title;
      },
      ...mapGetters([
        'activeItem'
      ])
    },
    methods: {
      backAction() {
        this.$emit('back');
      },
      tabClickAction(tab) {
        this.$emit('handleTabClick', tab);
      },
      openSourceAction() {
        this.$emit('openSource');
      },
      collectAction() {
        this.$emit('collect');
      },
      cancelCollectAction() {
        this.$emit('cancelCollect');
      }
    }
  };
</script>

<style lang="scss">
  #c-header {
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 1;
    /*窗口拖拽*/
    -webkit-app-region: drag;
  }

  .icons {
    margin-left: 10%;
    flex: 1 1 auto;
    i {
      margin-right: 4rem;
      font-size: 2rem;
      cursor: pointer;
    }
  }

  /*覆盖按钮默认样式*/
  .open-source {
    margin-right: 10% !important;
    font-size: 2rem !important;
  }

  .header-tab {
    height: 5rem;
    max-width: 100%;
    .el-tabs__header {
      margin-top: 0 !important;
    }
  }
</style>