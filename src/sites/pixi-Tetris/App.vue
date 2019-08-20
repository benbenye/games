<template>
  <div id="app">
    <div class="content">
      <div class="name">pixi-Tetris</div>
      <div class="menu">
        <div class="btn" @click="restart">new game</div>
        <div class="btn" @click="pause">pause</div>
        <div class="btn" @click="guide">use guide</div>
      </div>
    </div>
    <div id="box" class="box" ref="box">
      <ul id="tetris-bg" class="tetris-bg">
        <li v-for="(t, index) in 200" :key="index"></li>
      </ul>
      <div id="tetris"></div>
    </div>
    <game-over v-show="data.isGameOver"></game-over>

    <div class="control">
      <div class="btn up" @click="up">↑</div>
    </div>

    <div class="control">
      <div class="btn left" @click="left">←</div>
      <div class="btn down" @click="down">↓</div>
      <div class="btn right" @click="right">→</div>
    </div>
  </div>
</template>

<script>
import pixi from './pixi';
import data from './pixi-store';
import GameOver from './components/gameover.vue';

export default {
  name: 'Games-Tetris',
  components: {GameOver},
  data() {
    return {
      data,
      pixi
    }
  },
  mounted() {
    pixi.app();
  },
  methods: {
    restart() {
      pixi.app();
    },
    pause() {
      pixi.pause();
    },
    guide() {
      this.data.guide = !this.data.guide;
    },
    up() {
      pixi.movingContainer.up();
    },
    left() {
      pixi.movingContainer.left();
    },
    right() {
      pixi.movingContainer.right();
    },
    down() {
      pixi.movingContainer.down();
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
  .tetris-bg {
    background-color: #a0ac86;
    width: px2rem(500);
    height: px2rem(1000);
    display: flex;
    flex-wrap: wrap;
    li {
      background-image: url(./assets/one.png);
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.3;
      width: px2rem(50);
      height: px2rem(50);
      flex-shrink: 0;
    }
  }
  .box {
    width: 90%;
    margin: px2rem(50) auto;
    border-radius: px2rem(40);
    text-align: center;
    position: relative;
    #tetris {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
    .control {
      text-align: right;
      .btn {
        padding: px2rem(30);
        margin-left: px2rem(20);
        display: inline-block;
        color: #fff;
        background-color: #413e35;
        }
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
