<template>
  <game-over v-if="data.isGameOver"></game-over>
  <div v-else id="app">
    <div class="content">
      <div class="name">2048</div>
      <div class="menu">
        <input class="dimension" type="number" v-model="data.dimension" />
        <div class="btn" @click="restart">new game</div>
      </div>
    </div>
    <div id="box" class="box" ref="box">
      <div id="pixi"></div>
    </div>
  </div>
</template>

<script>
import {TouchDirection} from './touch';
import pixi from './pixi';
import data from './pixi-store';
import GameOver from './components/gameover.vue';

export default {
  name: 'Games-2048',
  components: {GameOver},
  data() {
    return {
      data
    }
  },
  mounted() {
    this.box = this.$refs.box;
    pixi.initView();
  },
  methods: {
    restart() {
      pixi.initView();
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/style/base.scss';
</style>

<style lang="scss" scoped>
@import '~@/assets/style/util.scss';
#app {
  .content {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    .name {
      color: #776e65;
      font-size: px2rem(150);
      font-weight: 900;
    }
    .menu {
      .dimension {
        width: px2rem(180);
        line-height: 2;
        font-size: px2rem(30);
        background-color: #bbada0;
        padding: px2rem(12);
        outline: none;
        border: none;
      }
      .btn {
        font-size: px2rem(30);
        background-color: #413e35;
        display: inline-block;
        color: #fff;
        margin-left: 30px;
        padding: px2rem(20);
        border-radius: 5px;
      }
    }
  }
  .box {
    background-color: #bbada0;
    margin: px2rem(50) auto;
    width: 90%;
    border: 6px solid #bbada0;
    border-radius: px2rem(40);
    canvas {
      vertical-align: top;
    }
  }
}
</style>
