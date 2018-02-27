<template>
  <div id="feedback">
    <div class="advice">
      应用存在异常？ <br>
      没有你想要的应用？<br>
      好的想法？<br>
      什么其他的？<br>
      发送邮件到 <a href="Mailto:cwuyiqing@163.com">cwuyiqing@163.com</a>，提出你宝贵的建议 <br>
      ~~~ <br>
      ~<span @click="show = !show">~</span>~ <br>
      <span v-if="show">{{path}}</span>
    </div>
  </div>
</template>

<script>
  import { dbPath } from '../../../dataStore';

  export default {
    name: 'feedback',
    data() {
      return {
        show: false,
        path: ''
      };
    },
    mounted() {
      this.path = dbPath;
    }
  };
</script>

<style lang="scss" scoped>
  .advice {
    width: 60%;
    margin: 3rem auto;
    color: #6f7180;
    font-size: 1.8rem;
    line-height: 3rem;
    a {
      color: #3A6676;
      text-decoration: underline;
    }
  }
</style>