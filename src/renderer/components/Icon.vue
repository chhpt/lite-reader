<template>
  <svg class="icon" aria-hidden="true" :style="{fontSize}">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  export default {
    name: 'icon',
    props: {
      name: {
        type: String,
        required: true
      },
      fontSize: {
        type: String,
        default: '2rem'
      }
    },
    computed: {
      iconName() {
        return `#icon-${this.name}`;
      }
    }
  };
</script>

<style scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>