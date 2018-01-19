<template>
  <div id="c-main">
    <router-view></router-view>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapGetters([
        'menu',
        'name'
      ])
    }
  };
</script>
<style lang="scss" scoped>
</style>
