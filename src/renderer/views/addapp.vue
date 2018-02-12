<template>
  <div id="add-app">
    <div class="search">
      <div class="title">
        搜索应用
      </div>
      <el-autocomplete
          placeholder="请输入应用名称"
          prefix-icon="el-icon-search"
          v-model="keywords"
          :fetch-suggestions="searchSuggest"
          @select="handleSelect"
          :trigger-on-focus="false"
          clearable>
      </el-autocomplete>
    </div>
    <div class="all-apps">
      <el-container>
        <el-aside width="160px">
          <div class="categories">
            <div class="category" v-for="(category, index) in categories">
              <div class="category-title" @click="loadAppList(index)" :class="{highlight: highlight[index]}">
                {{category.title}}
              </div>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="app-list">
            <div class="app" v-for="app in appList">
              <img :src="app.imageURL" alt="图标">
              <div class="app-info">
                <span @click="loadAppDetail(app)" class="app-name">
                  {{app.title}}
                </span>
                <div class="app-description">
                  {{app.description | formatDes}}
                </div>
              </div>
              <div class="follow">
                <el-button :loading="false">
                  关注
                </el-button>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { ipcRenderer } from 'electron';

  export default {
    name: 'add-app',
    data() {
      return {
        keywords: '',
        highlight: [],
        appList: [],
      };
    },
    computed: {
      ...mapGetters([
        'categories',
        'apps'
      ])
    },
    beforeMount() {
      this.fetchCategories().then(() => {
        const len = this.categories.length;
        if (len) {
          this.highlight = new Array(len);
          this.highlight.fill(false);
        }
      });
    },
    watch: {
      categories(v) {
        const apps = [];
        v.forEach((e) => {
          e.sections.forEach((app) => {
            const { title, imageURL, description, remoteid } = app;
            apps.push({
              value: title,
              title,
              description,
              imageURL,
              remoteid
            });
          });
        });
        this.setApps(apps);
      }
    },
    filters: {
      formatDes(v) {
        // 取字符串中的 3 个字符判断字符串主要是英文还是中文
        const point = parseInt(v.length / 3 < 1 ? 1 : v.length, 10);
        const flag = v.charCodeAt(0) || v.charCodeAt(point) || v.charCodeAt(point * 2);
        const len = flag ? 20 : 60;
        return v.length <= len ? v : `${v.slice(0, len)}...`;
      }
    },
    methods: {
      // 提供搜搜建议
      searchSuggest(queryString, cb) {
        const results = queryString ?
          this.apps.filter(app => app.value.includes(queryString)) : this.apps;
        if (results.length) {
          cb(results);
        } else {
          cb([{ value: '无搜索结果' }]);
        }
      },
      // 处理选中建议
      handleSelect(item) {
        ipcRenderer.send('new-window', {
          app: item,
          action: 'open',
          url: '/app_detail'
        });
      },
      loadAppList(i) {
        this.highlight.fill(false);
        this.highlight[i] = true;
        this.appList = this.categories[i].sections;
      },
      loadAppDetail(app) {
        ipcRenderer.send('new-window', {
          app,
          action: 'open',
          url: '/app_detail'
        });
      },
      ...mapMutations([
        'setApps'
      ]),
      ...mapActions([
        'fetchCategories'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  #add-app {
    width: 100%;
    height: 100%;
  }

  .search {
    margin: 4rem 0;
    .title {
      color: #303133;
      font-size: 2.5rem;
      font-weight: 600;
      text-align: center;
    }
    .el-autocomplete {
      width: 80%;
      display: block;
      margin: 2rem auto;
    }
  }

  .all-apps {
    width: 80%;
    height: calc(100% - 230px);
    margin: 2rem auto;
    .el-aside {
      overflow-y: auto;
    }
    .el-aside::-webkit-scrollbar {
      background: transparent;
    }
  }

  .categories {
    .category-title {
      display: flex;
      align-items: center;
      height: 4rem;
      padding: 0 2rem;
      cursor: pointer;
      color: #606266;
      &.highlight {
        color: #3a8ee6;
      }
    }
  }

  .app-list {
    height: 100%;
    margin-left: 2rem;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      background: transparent;
      width: 0.2rem;
    }
    &:hover::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    }

    &:hover::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    }
  }

  .app {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 8rem;
    margin: 1rem 2rem;
    img {
      width: 5rem;
      height: 5rem;
      border-radius: 1.25rem;
    }
    .app-info {
      width: calc(100% - 14rem);
      margin-left: 2rem;
      .app-name {
        font-size: 1.8rem;
        font-weight: 500;
        color: #303133;
        cursor: pointer;
      }
      .app-description {
        font-size: 1.4rem;
        margin-top: 0.6rem;
        color: #606266;
      }
    }
    .follow {
      margin-left: 2rem;
      .el-button {
        width: 5rem;
        padding: 0.6rem;
      }
    }
  }
</style>