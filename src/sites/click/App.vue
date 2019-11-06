<template>
  <div id="app">
		<div class="container" v-for="con in 4" :key="con">
    	<div v-for="item in 4" :key="item" class="block" :style="'background-color:' + colors[coo()]" @click="clearBgColor"></div>
		</div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ClickClick',
  data() {
    return {
			colors: ['#98eed4', '#f4c463', '#6fddce', '#4a90ff', 'rgb(30, 124, 96)', 'rgb(108, 101, 72)', 'rgb(227, 75, 221)', 'rgb(4, 190, 2)']
    }
  },
  methods: {
    coo() {
      return _.random(0, this.colors.length - 1);
    },
    clearBgColor(e) {
      e.srcElement.style.backgroundColor = ''
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/style/base.scss';
html, body {
  height: 100%;
}
</style>

<style lang="scss" scoped>
@import '~@/assets/style/util.scss';
#app {
    margin-left: auto;
    margin-right: auto;
    height: 100%;
		.container {
			display: flex;
      height: 25%;
		}
    .block {
			width: 10px;
			flex-grow: 1;
			height: 100%;
		}
}
</style>
