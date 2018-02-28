<template>
  <el-header height="50px" id="c-header">
    <div class="icons" v-if="backIcon">
      <i class="el-icon-arrow-left" @click="backAction"></i>
      <i class="el-icon-star-off"></i>
    </div>
    <el-tabs :value="active"
             @tab-click="tabClickAction"
             tab-position="bottom"
             class="header-tab">
      <el-tab-pane v-for="item in menu" :label="item.title" :name="item.title" :url="item.url" :key="item.title"
                   class="menu-item">
      </el-tab-pane>
    </el-tabs>
  </el-header>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'c-header',
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
    z-index: 0;
    /*窗口拖拽*/
    -webkit-app-region: drag;
  }

  .icons {
    position: absolute;
    left: 10%;
    i {
      margin-right: 3rem;
      font-size: 2rem;
      cursor: pointer;
    }
  }

  .header-tab {
    height: 5rem;
    max-width: 100%;
    .el-tabs__header {
      margin-top: 0 !important;
    }
  }
</style>