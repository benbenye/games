<template>
  <div id="app">
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
    <game-over v-show="data.isGameOver"></game-over>
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
    data.width = document.getElementById('box').clientWidth;
    pixi.initView();
  },
  methods: {
    restart() {
      data.width = document.getElementById('box').clientWidth;
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
    margin-left: auto;
    margin-right: auto;
  .content {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    .name {
      color: #776e65;
      font-weight: 900;
    }
    .menu {
      .dimension {
        width: px2rem(160);
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
        border-radius: 5px;
        padding: px2rem(10);
      }
    }
  }
  .box {
    width: 90%;
    margin: px2rem(50) auto;
    border-radius: px2rem(40);
    text-align: center;
  }
$moboleWidth: px2rem(640);
$pcMiddleWidth: px2rem(640);
$pcBigWidth: px2rem(350);

  @media screen and (min-width:640px){
    .content{
      width: $pcMiddleWidth;
      .name {
        font-size: px2rem(50);
      }
    }
    .box {
      width: $pcMiddleWidth;
    }
  }
  @media screen and (min-width:1024px){
    .content{
      width: $pcBigWidth;
      .name {
        font-size: px2rem(50);
      }
      .menu {
        .dimension {
          width: px2rem(70);
          line-height: 1;
          font-size: px2rem(16);
        }
        .btn {
          font-size: px2rem(16);
          padding: px2rem(10);
        }
      }
    }
    .box {
      width: $pcBigWidth;
    }
  }
}
</style>
