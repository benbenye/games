import _ from 'lodash';

let data = {};
initStore();

export function initStore() {
  data.boxId = 'tetris-bg';
  data.docId = 'tetris';
  data.delay = 1000;
  data.currentScore = 0;
  data.highestScore = 0;
  data.isGameOver = false;
  data.guide = true;
}

export default data;
