<template>
  <div id="account">
    <div class="personal">
      <div class="image-wrapper">
        <img src="https://blog-1252710547.cossh.myqcloud.com/background-3.jpg" alt="">
      </div>
      <div class="personal-info">
        <div class="username">
          {{account.username}}
        </div>
        <div class="email">
          {{account.email}}
        </div>
      </div>
      <div class="setting">
        <Icon name="shezhi1"></Icon>
      </div>
    </div>
    <div class="actions">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收藏" name="collection"></el-tab-pane>
        <el-tab-pane label="浏览历史" name="history"></el-tab-pane>
        <el-tab-pane label="关注应用" name="follow"></el-tab-pane>
      </el-tabs>
      <div class="list">
        <el-card class="card" v-for="item in list" :body-style="{padding: '1rem'}">
          <div class="item">
            <img :src="item.imageURL" alt="图标">
            <div class="item-info">
              <div class="title">
                {{item.title}}
              </div>
              <div class="description">
                {{item.description}}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import Icon from '@/components/Icon';
  import db from '../../dataStore';
  import API from '../api';

  const { getFollowAPPs } = API;

  export default {
    name: 'account',
    data() {
      return {
        activeName: 'collection',
        list: []
      };
    },
    computed: {
      account: () => db.get('account').value()
    },
    methods: {
      handleClick(tab) {
        const { index } = tab;
        this.list = [];
        switch (index) {
          case '0':
            this.getCollection();
            break;
          case '1':
            this.getBrowserHistory();
            break;
          case '2':
            this.getFollowAPPs();
            break;
          default:
        }
      },
      getCollection() {
        console.log('c');
      },
      getBrowserHistory() {
        console.log('h');
      },
      async getFollowAPPs() {
        const res = await getFollowAPPs();
        if (res.status) {
          this.list = res.apps;
          db.set('user.follows', res.apps).write();
        }
      }
    },
    components: {
      Icon
    }
  };
</script>

<style lang="scss" scoped>
  @import "../styles/common.scss";

  #account {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .personal {
    display: flex;
    padding: 2rem;
    width: 100%;
    height: 10rem;
    .image-wrapper {
      width: 6rem;
      height: 6rem;
      flex: 0 0 auto;
      border-radius: 3rem;
      img {
        width: 6rem;
        height: 6rem;
        border-radius: 3rem;
      }
    }

    .personal-info {
      flex: 1 1 auto;
      margin-left: 2rem;
      .username {
        margin: 0.5rem 0;
        font-size: 2rem;
        font-weight: 600;
      }
      .email {
        color: #6f7180;
        margin: 1rem 0;
      }
    }

    .setting {
      margin-right: 2rem;
      flex: 0 0 auto;
      .icon {
        cursor: pointer;
      }
    }
  }

  .actions {
    height: calc(100% - 10rem);
    padding: 0 2rem;
    .el-tabs {
      height: 5rem;
    }
  }

  .list {
    height: calc(100% - 5rem);
    overflow: scroll;
    @include scroll;
    .card {
      margin: 1rem 0;
      .el-card__body {
        padding: 0;
      }
      img {
        width: 5rem;
        height: 5rem;
        border-radius: 1.25rem;
      }
      .item {
        display: flex;
      }
      .item-info {
        margin-left: 2rem;
      }
      .title {
        font-size: 1.8rem;
        font-weight: 500;
      }
      .description {
        margin-top: 0.8rem;
      }
    }
  }
</style>