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
    <AccountActions classs="actions"></AccountActions>

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
               @close="handleSettingDialogClose"
               class="setting-dialog">
      <!--表单-->
      <el-form :model="editAccount"
               :rules="checkRules"
               ref="userForm"
               label-width="50px"
               class="account-form">
        <!--昵称设置-->
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
        <!--邮箱设置-->
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
        <!--密码设置-->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editAccount.oldPassword"
                    placeholder="请输入你的原始密码"
                    clearable
                    type="password"></el-input>
          <el-input v-model="editAccount.newPassword"
                    placeholder="请输入你的新密码"
                    clearable
                    type="password"></el-input>
          <el-button type="text" @click="changePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Icon from '../Icon';
  import AccountActions from './actions';
  import API from '../../api';
  import passwordEncrypt from '../../utils/encrypt';

  export default {
    name: 'account',
    data() {
      return {
        usernameEditing: false,
        emailEditing: false,
        settingDialogVisible: false,
        accountDialogVisible: false,
        editAccount: {
          username: '',
          email: '',
          newPassword: '',
          oldPassword: ''
        },
        checkRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
        },
      };
    },
    computed: {
      ...mapGetters([
        'account',
      ])
    },
    methods: {
      handleLogout() {
        this.userLogout().then((res) => {
          if (res.status) {
            this.$message({
              message: '注销成功',
              duration: '1000'
            });
            this.$router.push('/manage');
          }
          this.sendFollowAPPs([]);
          this.accountDialogVisible = false;
        });
      },
      // 编辑个人信息（点击设置图标）
      editSetting() {
        this.editAccount = Object.assign({}, this.account);
        this.settingDialogVisible = true;
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
        // 验证数据
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            // 保存设置，更新数据
            this.changeUserInfo({
              [data]: this.editAccount[data]
            }).then((res) => {
              if (res.status) {
                this.$message({
                  message: '更新成功',
                  duration: '1000'
                });
                this.usernameEditing = false;
                this.emailEditing = false;
              }
            });
          }
        });
      },
      handleSettingDialogClose() {
        this.usernameEditing = false;
        this.emailEditing = false;
      },
      async changePassword() {
        const { newPassword, oldPassword } = this.editAccount;
        if (newPassword && oldPassword) {
          // 对密码进行加密
          const oldCipher = passwordEncrypt(oldPassword).toString();
          const newCipher = passwordEncrypt(newPassword).toString();
          const res = await API.changePassword(oldCipher, newCipher);
          if (res.status) {
            this.$message('密码修改成功');
          } else {
            this.$message({
              message: res.error,
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: '密码不能为空',
            type: 'error'
          });
        }
      },
      ...mapActions([
        'userLogout',
        'changeUserInfo',
        'changeUserPassword'
      ])
    },
    components: {
      Icon,
      AccountActions
    }
  };
</script>

<style lang="scss">
  #account {
    width: 100%;
    height: 100%;
    padding-top: 3rem;
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
  }

  // 设置对话框
  .setting-dialog {
    top: 4rem;
    height: calc(100% - 4rem) !important;
  }

  .account-form {
    width: 80%;
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