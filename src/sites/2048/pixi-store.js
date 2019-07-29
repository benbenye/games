import _ from 'lodash';

let data = {};
initStore();

export function initStore() {
  data.dimension = 4;
  data.margin = 6;
  data.speed = 10;
  data.currentScore = 0;
  data.highestScore = 0;
  data.isGameOver = false;
}

export default data;
