<template>
  <div id="login">
    <div class="title">
      LiteReader
    </div>
    <div class="form">
      <el-form :model="userForm"
               :rules="checkRules"
               label-position="top"
               ref="userForm"
               :inline="true"
               label-width="80px"
               class="user-form">
        <el-form-item label="用户名" prop="username" v-if="register">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" :class="{'email-input': register}"></el-input>
          <el-popover
              placement="top"
              width="120"
              trigger="hover"
              content="点击发送验证码到你的邮箱！">
            <el-button type="text"
                       class="send-code"
                       @click="sendCode"
                       v-if="register"
                       :disabled="verified"
                       slot="reference">发送验证码
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="密码" prop="password" :class="{password: register}">
          <el-input type="password" v-model="userForm.password" @keyup.enter.native="handleAction"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" class="code" v-if="register">
          <el-input v-model="userForm.code"></el-input>
        </el-form-item>
      </el-form>
      <div class="operation">
        <div class="register">
          <el-button type="text" @click="toggleFunction">{{registerText}}</el-button>
        </div>
        <div class="action">
          <el-button type="primary" @click="handleAction">{{actionText}}</el-button>
        </div>
      </div>
      <div class="intro-text" v-if="!opened">
        请登录你的账号，使用全部功能。
        点击<span @click="redirection">跳过</span>直接体验。
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { ipcRenderer } from 'electron';
  import passwordEncrypt from '../utils/encrypt';
  import API from '../api';

  const { sendVerificationCode } = API;

  export default {
    name: 'login',
    data() {
      return {
        register: false,
        registerText: '注册账号',
        actionText: '登录',
        verified: false,
        userForm: {
          email: '',
          username: '',
          password: '',
          code: ''
        },
        checkRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入你的用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 8, message: '密码长度不得小于 8 位', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      ...mapGetters([
        'opened'
      ])
    },
    beforeDestroy() {
      // 设置已打开过应用
      this.setOpenStatus(true);
    },
    methods: {
      toggleFunction() {
        this.register = !this.register;
        this.registerText = this.register ? '登录账号' : '注册账号';
        this.actionText = this.register ? '注册' : '登录';
      },
      redirection() {
        this.$router.push('/');
      },
      async sendCode() {
        const { email } = this.userForm;
        if (!email) {
          this.$message({
            type: 'error',
            message: '邮箱不能为空'
          });
          return;
        }
        try {
          /* eslint-disable no-useless-escape */
          // 邮箱格式校验
          const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          const valid = reg.test(email);
          if (!valid) {
            this.$message({
              message: '邮箱格式错误',
              type: 'error'
            });
            return;
          }
          this.verified = true;
          const res = await sendVerificationCode(email);
          if (res.status) {
            this.$message('验证码发送成功，请查看你的邮箱');
            this.verified = false;
          } else {
            this.$message({
              type: 'error',
              message: res.error
            });
            this.verified = false;
          }
        } catch (err) {
          this.verified = false;
        }
      },
      handleAction() {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            // 注册
            if (this.register) {
              this.handleRegister();
            }
            // 登录
            if (!this.register) {
              this.handleLogin();
            }
          }
        });
      },
      async handleLogin() {
        const { email, password } = this.userForm;
        // 对密码进行加密
        const cipher = passwordEncrypt(password);
        const res = await this.userLogin({ email, password: cipher.toString() });
        if (res.status) {
          this.$message({
            message: '登录成功！',
            duration: '1000'
          });
          // 第一次打开直接登录
          if (!this.opened) {
            this.$router.push('/');
          } else {
            // 向主进程同步账号数据
            ipcRenderer.send('synchronous-data-main', {
              action: 'send-account',
              data: {
                account: res.account
              }
            });
            // 从账号设置登录
            this.$router.push('/manage/account');
          }
        } else {
          this.$message({
            message: res.error,
            type: 'error'
          });
        }
      },
      async handleRegister() {
        const { username, email, password, code } = this.userForm;
        // 对密码进行加密
        const cipher = passwordEncrypt(password);
        const res = await this.userRegister({
          username,
          email,
          code,
          password: cipher.toString()
        });
        if (res.status) {
          this.$message('注册成功！');
          // 第一次打开直接登录
          if (!this.opened) {
            this.$router.push('/');
          } else {
            // 从账号设置登录
            this.$router.push('/manage/account');
          }
        } else {
          this.$message({
            message: res.error,
            type: 'error'
          });
        }
      },
      ...mapMutations([
        'setOpenStatus'
      ]),
      ...mapActions([
        'userRegister',
        'userLogin'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  .title {
    text-align: center;
    margin: 2rem 0;
    font-size: 3rem;
    font-weight: 700;
    span {
      font-size: 1.6rem;
      font-weight: 400;
      margin-top: 1.2rem;
      margin-left: 1rem;
    }
  }

  .form {
    width: 42rem;
    margin: 0 auto;
    .el-form-item {
      width: 100%;
      margin-right: 0;
    }
    .email-input {
      width: calc(100% - 10rem);
    }
    .send-code {
      margin-left: 1rem;
      width: 8rem;
    }
    .password {
      width: 60%;
    }
    .code {
      width: 38%;
    }
  }

  .register {
    display: flex;
    justify-content: flex-end;
  }

  .action {
    display: flex;
    justify-content: center;
  }

  .intro-text {
    margin: 2rem 0;
    span {
      color: #3a8ee6;
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>