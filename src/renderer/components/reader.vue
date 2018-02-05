<template>
  <div id="reader">
    <el-container>
      <el-header height="60px">
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
            --------- End ---------
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
        this.$router.push('/list');
      }
    },
    computed: {
      ...mapGetters([
        'article'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  @import '../styles/reader.css';

  #reader {
    height: 100%;
  }

  .el-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
    background: #fff;
    -webkit-app-region: drag;
    i {
      font-size: 2rem;
      cursor: pointer;
    }
  }

  .article {
    width: 80%;
    margin: 4rem auto;
    text-align: left;
    font-weight: 400;
    line-height: 3.2rem;
    .article-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 3rem 0;
    }
    .publish-time {
      margin: 1rem 0;
    }
    .ending{
      margin: 2rem 0;
      display: flex;
      justify-content: center;
    }
  }
</style>