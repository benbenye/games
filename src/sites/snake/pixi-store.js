import _ from 'lodash';

let data = {};
initStore();

export function initStore() {
  data.boxId = 'box';
  data.docId = 'snake';
  data.delay = 500;
  data.initLength = 10;
  data.currentScore = 0;
  data.highestScore = 0;
  data.isGameOver = false;
}

export default data;
