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
      <el-container class="container">
        <el-aside width="160px">
          <div class="categories">
            <div class="category" v-for="(category, index) in categories">
              <div class="category-title"
                   @click="loadAppList(index)"
                   :class="{highlight: highlight[index]}">
                <span v-if="highlight[index]" :style="{color: themeColor.value}">{{category.title}}</span>
                <span v-if="!highlight[index]">{{category.title}}</span>
              </div>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="app-list">
            <div class="app" v-for="(app, index) in appList">
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
                <el-button v-if="!app.followed" @click="handleFollowAPP(app)">关注</el-button>
                <el-button type="primary"
                           icon="el-icon-check"
                           v-if="app.followed"
                           @click="handleCancelFollow(app)">
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
  import db from '../../dataStore';

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
        'apps',
        'account',
        'followAPPs',
        'themeColor'
      ])
    },
    beforeMount() {
      // 临时获取缓存目录
      const categories = db.get('app.categories').value();
      this.setCategories(categories);
      // 获取远程的目录
      this.fetchCategories().then((res) => {
        // 将远程目录存储到本地
        db.set('app.categories', res).write();
        // 以分类的长度建立高亮数组
        const len = this.categories.length;
        if (len) {
          this.highlight = new Array(len);
          this.highlight.fill(false);
          // 默认加载第一个分类
          this.highlight[0] = true;
        }
      });
      // 默认加载第一个分类
      this.loadAppList(0);
    },
    watch: {
      categories(v) {
        const apps = [];
        v.forEach((e) => {
          e.sections.forEach((app) => {
            app.value = app.title;
            apps.push(app);
          });
        });
        this.setAPPs(apps);
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
        this.appList = [];
        this.highlight.fill(false);
        this.highlight[i] = true;
        // 获取关注的应用
        if (this.followAPPs.length) {
          this.appList = this.categories[i].sections.map((e) => {
            const app = this.followAPPs.find(v => v.title === e.title);
            e.followed = Boolean(app) && !app.delete;
            return e;
          });
        } else {
          this.appList = this.categories[i].sections;
        }
      },
      async handleFollowAPP(app) {
        // 没有登录，不能关注应用
        if (!this.account) {
          this.$message({
            message: '你尚未登录，不能进行操作',
            type: 'error'
          });
          return;
        }
        // 关注应用
        const res = await this.userFollowAPP({ app });
        if (res.status) {
          this.$message('关注成功');
          // 获取应用的序号
          const index = this.appList.findIndex(e => e.title === app.title);
          const followedAPP = this.appList[index];
          followedAPP.followed = true;
          // 通过替换 appList 中的元素触发 DOM 更新
          this.appList.splice(index, 1, followedAPP);
        } else {
          this.$message({
            message: res.error,
            type: 'error'
          });
        }
      },
      async handleCancelFollow(app) {
        // 没有登录，不能取消关注应用
        if (!this.account) {
          this.$message({
            message: '你尚未登录，不能进行操作',
            type: 'error'
          });
          return;
        }
        // 取消关注
        const res = await this.cancelUserFollowAPP({ app });
        if (res.status) {
          this.$message('取消关注成功');
          // 获取应用的序号
          const index = this.appList.findIndex(e => e.title === app.title);
          const followedAPP = this.appList[index];
          followedAPP.followed = false;
          // 通过替换 appList 中的元素触发 DOM 更新
          this.appList.splice(index, 1, followedAPP);
        } else {
          this.$message({
            type: 'error',
            message: res.error
          });
        }
      },
      loadAppDetail(app) {
        ipcRenderer.send('new-window', {
          app,
          action: 'open',
          url: '/app_detail'
        });
      },
      ...mapMutations([
        'setAPPs',
        'setCategories'
      ]),
      ...mapActions([
        'fetchCategories',
        'userFollowAPP',
        'cancelUserFollowAPP'
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
    .container {
      height: 100%;
    }
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
      color: #909399;
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
      flex: 1 1 auto;
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