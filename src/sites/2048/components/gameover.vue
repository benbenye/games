<template>
  <div class="game-over">
    <div class="text">game over!</div>
    <div class="btn" @click="newGame">new game</div>
  </div>
</template>

<script>
import pixi from '../pixi';
import data from '../pixi-store';

export default {
  name: 'GameOver',
  props: {
  },
  methods: {
    newGame() {
      data.width = document.getElementById('app').clientWidth;
      pixi.initView();
    }
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
  background-color: rgba($color: #a5a4a7, $alpha: 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: px2rem(30);

  .text , .btn{
    padding: px2rem(20);
    border-radius: px2rem(10);
  }
  .text {
    background-color: azure;
  }
  .btn {
    margin-top: px2rem(20);
    background-color: #999;
  }
}
</style>
