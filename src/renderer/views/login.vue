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
               label-width="80px"
               class="user-form">
        <el-form-item label="用户名" prop="username" v-if="register">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
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
      <div class="intro-text" v-if="firstOpen">
        请登录你的账号，使用全部功能。
        点击<span @click="redirection">跳过</span>直接体验。
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import db from '../../dataStore';
  import passwordEncrypt from '../utils/encrypt';

  export default {
    name: 'login',
    data() {
      return {
        userForm: {
          email: '',
          username: '',
          password: ''
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
          ]
        },
        register: false,
        registerText: '注册账号',
        actionText: '登录',
        firstOpen: true
      };
    },
    mounted() {
      const opened = db.get('app.opened').value();
      if (!opened) {
        db.set('app.opened', true).write();
        this.firstOpen = true;
      } else {
        this.firstOpen = false;
      }
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
      async handleAction() {
        // 注册
        if (this.register) {
          const { username, email, password } = this.userForm;
          // 对密码进行加密
          const cipher = passwordEncrypt(password);
          const res = await this.userRegister({ username, email, password: cipher.toString() });
          if (res.status) {
            this.$message('注册成功！');
          } else {
            this.$message({
              message: res.error,
              type: 'error'
            });
          }
        }
        // 登录
        if (!this.register) {
          const { email, password } = this.userForm;
          // 对密码进行加密
          const cipher = passwordEncrypt(password);
          const res = await this.userLogin({ email, password: cipher.toString() });
          if (res.status) {
            this.$message('登录成功！');
            const { username, id } = res;
            const account = {
              email,
              username,
              id
            };
            db.set('user.account', account).write();
            this.$router.push('/manage/account');
          } else {
            this.$message({
              message: res.error,
              type: 'error'
            });
          }
        }
      },
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