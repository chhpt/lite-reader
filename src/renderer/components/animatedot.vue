<template>
  <div id="animate-dot" v-if="loading">
    <div class="loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<script>
  import Dynamics from 'dynamics.js';

  export default {
    name: 'animatedot',
    data() {
      return {
        timer: null,
        colors: ['#007eff', '#ff3700', '#92ff00']
      };
    },
    props: {
      loading: {
        default: false,
        require: true
      }
    },
    mounted() {
      this.dots = document.querySelectorAll('.dot');
      this.animateDots();
    },
    watch: {
      loading(v) {
        if (v) {
          this.animateDots();
        } else {
          clearInterval(this.timer);
        }
      }
    },
    methods: {
      animateDots() {
        this.dots.forEach((dot, i) => {
          Dynamics.animate(dot, {
            translateY: -50,
            backgroundColor: this.colors[i]
          }, {
            type: Dynamics.forceWithGravity,
            bounciness: 800,
            elasticity: 200,
            duration: 1500,
            delay: i * 300
          });
        });
        this.timer = Dynamics.setTimeout(this.animateDots, 2000);
      }
    }
  };
</script>

<style lang="scss" scoped>
  #animate-dot {
    height: 10rem;
    display: flex;
  }

  .loader {
    display: flex;
    width: fit-content;
    align-self: flex-end;
    margin: 0 auto;
    .dot {
      margin: 0 1rem;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 1rem;
      background: #000;
    }
  }
</style>