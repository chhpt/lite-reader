<template>
  <div id="error">
    <el-steps :active="1" simple align-center class="network-error">
      <el-step title="网络异常" icon="el-icon-loading"></el-step>
      <el-step title="加载失败" icon="el-icon-sort"></el-step>
      <el-step title="请检查你的网络" icon="el-icon-check"></el-step>
    </el-steps>
  </div>
</template>

<script>
  export default {
    name: 'error',
    data() {
      return {};
    },
    mounted() {
      // const { status } = this.$route.query;
    }
  };
</script>

<style lang="scss" scoped>
  #error{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .network-error {
    width: 75%;
    margin: 0 auto;
  }
</style>