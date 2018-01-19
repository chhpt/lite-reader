<template>
  <div id="c-aside">
    <div class="title">
      应用
    </div>
    <div class="line"></div>
    <div v-for="app in appList" class="app">
      <img :src="app.icon" alt="app">
      <span @click="getAppMenu(app.id)" class="app-name">{{app.name}}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    methods: {
      getAppMenu(id) {
        this.setLoading(true);
        this.$store.commit('setAppName', id);
        this.fetchMenu(id).then(() => {
          this.setLoading(false);
        });
        this.$router.push('list');
      },
      ...mapMutations([
        'setLoading'
      ]),
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
  .title {
    font-size: 1.8rem;
    margin: 1rem 2rem;
    color: #606266;
  }

  .line {
    height: 1px;
    margin: 1rem 2rem;
    background-color: #bbb;
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
    }
    .app-name {
      cursor: pointer;
    }
  }
</style>