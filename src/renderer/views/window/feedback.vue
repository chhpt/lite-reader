<template>
  <div id="feedback">
    <div class="advice">
      应用存在异常？ <br>
      没有你想要的应用？<br>
      好的想法？<br>
      什么其他的？<br>
      发送邮件到 <a href="Mailto:cwuyiqing@163.com">cwuyiqing@163.com</a>，提出你宝贵的建议~~~
    </div>
  </div>
</template>

<script>
  export default {
    name: 'feedback'
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