<template>
  <div class="game-over">
  </div>
</template>

<script>
export default {
  name: 'GameOver',
  props: {
  }
};
</script>

<style lang="scss" scoped>
@import '~@/assets/style/util.scss';
.game-over {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba($color: #bbada0, $alpha: 0.5);
}
</style>
