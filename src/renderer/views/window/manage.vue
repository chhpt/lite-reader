<template>
  <div id="setting">
    <el-container>
      <el-aside width="16rem">
        <el-menu default-active="1"
                 router>
          <el-menu-item index="/manage/account">
            <Icon name="yonghu" font-size="2.5rem"></Icon>
            <span slot="title">我的账户</span>
          </el-menu-item>
          <el-menu-item index="/manage/setting">
            <Icon name="shezhi" font-size="2.5rem"></Icon>
            <span slot="title">应用设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import Icon from '../../components/Icon';
  import bus from '../../utils/bus';

  export default {
    name: 'setting',
    mounted() {
      bus.$on('manage-message', (message) => {
        this.$notify({
          message,
          title: '提示',
          duration: 2000,
          offset: 30
        });
      });
    },
    methods: {
      handleMenuSelect(index) {
        this.$router.push(index);
      }
    },
    components: {
      Icon
    }
  };
</script>

<style lang="scss" scoped>
  #setting,
  .el-container,
  .el-aside,
  .el-menu {
    height: 100%;
    width: 100%;
  }

  .el-main {
    padding: 0;
  }

  .el-menu-item {
    display: flex;
    align-items: center;
    font-size: 1.5rem !important;
    span {
      margin-left: 0.6rem;
    }
  }

  .el-aside {
    padding-top: 4rem;
    overflow: hidden;
  }
</style>