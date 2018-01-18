<template>
  <div id="c-aside">
    <div v-for="app in appList" class="app">
      <img :src="app.icon" alt="app">
      <span @click="getAppMenu(app.id)" class="app-name">{{app.name}}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    methods: {
      getAppMenu(id) {
        this.fetchMenu(id);
      },
      ...mapActions([
        'fetchMenu'
      ])
    },
    computed: {
      ...mapGetters([
        'appList'
      ])
    },
  };
</script>

<style lang="scss" scoped>
  .app {
    display: flex;
    align-items: center;
    height: 6rem;
    img {
      width: 4rem;
      height: 4rem;
      margin: 1rem 1rem 1rem 2rem;
    }
    .app-name {
      cursor: pointer;
    }
  }
</style>