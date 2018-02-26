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
      <div class="setting" @click="editSetting">
        <Icon name="shezhi1"></Icon>
      </div>
      <div class="exit" @click="accountDialogVisible = true">
        <Icon name="tuichu"></Icon>
      </div>
    </div>
    <div class="actions">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收藏" name="collection"></el-tab-pane>
        <el-tab-pane label="浏览历史" name="history"></el-tab-pane>
        <el-tab-pane label="关注应用" name="follow"></el-tab-pane>
      </el-tabs>
      <div class="list">
        <el-card class="card" v-for="(item, index) in list" :key="index" :body-style="{padding: '1rem'}">
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
            <div class="item-action">
              <el-button type="text" @click="handleCancelFollow(item)">取消关注</el-button>
            </div>
          </div>
        </el-card>
        <el-card v-if="!list.length" class="card">
          暂时没有数据
        </el-card>
      </div>
    </div>
    <!--退出账号-->
    <el-dialog
        title="提示"
        :visible.sync="accountDialogVisible"
        width="30%">
      <span>确认退出账号吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="accountDialogVisible = false">取 消</el-button>
        <el-button type="text" @click="handleLogout">确 定</el-button>
      </span>
    </el-dialog>
    <!--个人账号信息设置-->
    <el-dialog title="个人信息设置"
               :visible.sync="settingDialogVisible"
               :modal="false"
               fullscreen
               class="setting-dialog">
      <!--表单-->
      <el-form :model="editAccount"
               :rules="checkRules"
               ref="userForm"
               label-width="50px"
               class="account-form">
        <el-form-item label="昵称" prop="username">
          <el-input v-model="editAccount.username"
                    placeholder="请输入你的昵称"
                    @focus="usernameEditing = true"
                    clearable
                    ref="username"></el-input>
          <el-button type="text" icon="el-icon-edit" @click="edit('username')" v-if="!usernameEditing">编 辑</el-button>
          <el-button type="text" @click="saveSetting('username')" v-show="usernameEditing">保 存</el-button>
          <el-button type="text" @click="cancelEdit('username')" v-show="usernameEditing">取 消</el-button>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editAccount.email"
                    placeholder="请输入你的邮箱"
                    @focus="emailEditing = true"
                    clearable
                    ref="email"></el-input>
          <el-button type="text" icon="el-icon-edit" @click="edit('email')" v-if="!emailEditing">编 辑</el-button>
          <el-button type="text" @click="saveSetting('email')" v-show="emailEditing">保 存</el-button>
          <el-button type="text" @click="cancelEdit('email')" v-show="emailEditing">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { ipcRenderer } from 'electron';
  import Icon from './Icon';

  export default {
    name: 'account',
    data() {
      return {
        activeName: 'collection',
        list: [],
        usernameEditing: false,
        emailEditing: false,
        settingDialogVisible: false,
        accountDialogVisible: false,
        editAccount: {
          username: '',
          email: ''
        },
        checkRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入你的用户名', trigger: 'blur' }
          ],
        },
      };
    },
    computed: {
      ...mapGetters([
        'followAPPs',
        'account'
      ])
    },
    methods: {
      // 向主进程同步关注应用
      sendFollowAPPs(apps) {
        ipcRenderer.send('follow-action', {
          apps
        });
      },
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
            // 获取关注的应用
            if (this.followAPPs.length) {
              this.list = this.followAPPs;
            }
            break;
          default:
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
          const { apps } = res;
          this.list = apps;
          // 同步主进程状态
          this.sendFollowAPPs(apps);
        } else {
          this.$message({
            type: 'error',
            message: res.error
          });
        }
      },
      handleLogout() {
        this.userLogout().then((res) => {
          if (res.status) {
            this.$message({
              message: '注销成功',
              duration: '1000'
            });
            this.$router.push('/manage');
          }
          this.accountDialogVisible = false;
        });
      },
      // 编辑个人信息（点击设置图标）
      editSetting() {
        this.settingDialogVisible = true;
        this.editAccount = Object.assign({}, this.account);
      },
      edit(data) {
        this.$refs[data].focus();
        this[`${data}Editing`] = true;
      },
      cancelEdit(data) {
        this.editAccount[data] = this.account[data];
        this[`${data}Editing`] = false;
      },
      saveSetting(data) {
        // 更新本地的数据
        this.changeUserInfo({
          [data]: this.editAccount[data]
        }).then((res) => {
          if (res.status) {
            this.$message({
              message: '更新成功',
              duration: '1000'
            });
          }
        });
      },
      getCollection() {
      },
      getBrowserHistory() {
      },
      ...mapActions([
        'userLogout',
        'changeUserInfo',
        'cancelUserFollowAPP'
      ])
    },
    components: {
      Icon
    }
  };
</script>

<style lang="scss">
  @import "../styles/common";

  #account {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .personal {
    display: flex;
    padding: 2rem 5rem;
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

    .setting,
    .exit {
      margin-right: 2rem;
      height: 2rem;
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
      margin: 0 3rem;
      height: 5rem;
    }
  }

  .list {
    height: calc(100% - 5rem);
    overflow: scroll;
    @include normalScrollbar;
    .card {
      margin: 1rem 3rem;
      img {
        width: 5rem;
        height: 5rem;
        border-radius: 1.25rem;
      }
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .item-info {
        margin-left: 2rem;
        flex: 1 1 auto;
      }
      .title {
        font-size: 1.8rem;
        font-weight: 500;
      }
      .description {
        margin-top: 0.8rem;
      }
      .item-action {
        display: flex;
        align-items: center;
      }
    }
  }

  // 设置对话框
  .setting-dialog {
    top: 4rem;
    height: calc(100% - 4rem) !important;
  }

  .account-form {
    width: 80%;
    .el-form-item {
      margin-bottom: 1rem;
    }
    .el-form-item__content {
      display: flex;
    }
    .el-input {
      min-width: 20rem;
      input {
        border: 1px solid #fff !important;
        outline: none;
        padding: 0;
      }
    }
  }
</style>