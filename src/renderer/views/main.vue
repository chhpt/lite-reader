<template>
  <div id="c-main">
    <el-container>
      <el-header height="60px">
        <el-tabs v-model="activeItem" @tab-click="handleTabClick" tab-position="bottom">
          <el-tab-pane v-for="item in menu" :label="item.title" :name="item.title" class="menu-item">
          </el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main></el-main>
    </el-container>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        activeItem: '',
      };
    },
    computed: {
      ...mapGetters([
        'menu'
      ])
    },
    methods: {
      handleTabClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-header {
    display: flex;
    align-items: center;
    padding: 0;
  }

  .el-tabs {
    height: 6rem;
    padding: 0 2rem;
    width: 100%;
  }
</style>
