<template>
  <div id="app">
    <div class="name">2048</div>
    <input class="dimension" type="number" v-model="dimension" />
    <div class="btn" @click="rebuild">dimension</div>
    <div class="btn" @click="restart">restart</div>
    <div class="btn" @click="removeSprite">removeSprite</div>
    <div id="box" class="box" ref="box">
      <div id="pixi"></div>
      <piece-number v-for="(piece, index) in data.chess" :key="index" :n="piece.piece" />
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
    data.init(this.dimension);
    TouchDirection(this.box);
  },
  methods: {
    restart() {
      data.restart();
    },
    rebuild() {
      data.init(this.dimension);
    },
    removeSprite() {
      data.removeSprite();
    }
  }
};
</script>

<style lang="scss">
@import url(~@/assets/style/base.scss);
</style>

<style lang="scss" scoped>
// @import url(~@/assets/style/util.scss);
$ss: 20px;
.name {
  color: #776e65;
  font-size: $ss;
  font-weight: 900;
}
.box {
  width: 80%;
  padding: 6px;
  background-color: #bbada0;
  display: flex;
  flex-wrap: wrap;
}
.btn {
  background-color: #413e35;
  display: inline-block;
  color: #fff;
  margin-left: 30px;
  padding: $ss;
  border-radius: 5px;
}
</style>
