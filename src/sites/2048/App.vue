<template>
  <div id="app">
    <div class="name">2048</div>
    <input class="dimension" type="number" v-model="dimension" />
    <div class="btn" @click="rebuild">dimension</div>
    <div class="btn" @click="restart">restart</div>
    <div id="box" class="box" ref="box">
      <div id="pixi"></div>
      <!-- <piece-number v-for="(piece, index) in data.chess" :key="index" :n="piece.piece" /> -->
    </div>
  </div>
</template>

<script>
import {TouchDirection} from './touch';
import {data} from './chess_pixi';
import PieceNumber from './components/number.vue';

export default {
  name: 'Games-2048',
  components: {PieceNumber},
  data() {
    return {
      data,
      dimension: 5
    }
  },
  mounted() {
    this.box = this.$refs.box;
    data.init(this.dimension, TouchDirection(this.box));
  },
  methods: {
    restart() {
      data.restart();
    },
    rebuild() {
      data.init(this.dimension);
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
  // width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.name {
  color: #776e65;
  font-size: px2rem(100);
  font-weight: 900;
}
.box {
  background-color: #bbada0;
  margin-top: px2rem(50);
  canvas {
    margin: 6px;
  }
}
.btn {
  background-color: #413e35;
  display: inline-block;
  color: #fff;
  margin-left: 30px;
  padding: px2rem(20);
  border-radius: 5px;
}
</style>
