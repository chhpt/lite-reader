<template>
  <div id="reader">
    <el-container>
      <el-header height="50px">
        <i class="el-icon-arrow-left" @click="back"></i>
      </el-header>
      <el-main>
        <div class="article">
          <div class="article-title">
            {{article.title}}
          </div>
          <div class="publish-time">
            {{article.time}}
          </div>
          <div class="article-content" v-html="article.content">
          </div>
          <div class="ending" v-if="article.title">
            --------- END ---------
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'reader',
    data() {
      return {};
    },
    methods: {
      back() {
        const path = this.routeHistory.pop();
        this.$router.push(path);
      }
    },
    computed: {
      ...mapGetters([
        'article',
        'routeHistory'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  @import '../styles/reader.css';

  #reader {
    height: 100%;
    overflow: hidden;
  }

  .el-container {
    height: 100%;
    line-height: 3.5rem;
  }

  .el-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
    background: #fff;
    i {
      font-size: 2rem;
      cursor: pointer;
    }
  }

  .el-main {
    height: calc(100% - 5rem);
    &::-webkit-scrollbar {
      background: transparent;
      width: 0.4rem;
    }
    &:hover::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    }

    &:hover::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px #6f7180;
      border-radius: 0.2rem;
    }
  }

  .article {
    width: 80%;
    margin: 4rem auto;
    text-align: left;
    font-weight: 400;
    .article-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 3rem 0;
    }
    .publish-time {
      margin: 1rem 0;
    }
    .ending {
      margin: 2rem 0;
      display: flex;
      justify-content: center;
    }
  }
</style>