import _ from 'lodash';

let data = {};
initStore();

export function initStore() {
  data.boxId = 'tetris-bg';
  data.docId = 'tetris';
  data.delay = 100;
  data.currentScore = 0;
  data.highestScore = 0;
  data.isGameOver = false;
}

export default data;
