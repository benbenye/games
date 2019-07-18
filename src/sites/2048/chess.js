import _ from 'lodash';
export const data = {
  dimension: 0,
  currentScore: 0,
  highestScore: 0,
  chess: [],
  init,
  restart
}

function init (n = 4) {
  data.dimension = n;
  initChess();
  initPieces();
  initPieces();

}


function initChess () {
  const n = data.dimension;
  data.chess = _.zipWith(
    _.fill(Array(n * n), 0, 0, n * n),
    _.range(n * n),
    (piece, index) => ({piece, index}));
}

function initPieces() {
  let index = random();
  data.chess.splice(index, 1, {piece: 2, index});
}

function restart () {
  initChess();
  init();
}

function random () {
  if (isOver()) return;
  let randomChess = _.filter(data.chess, ({piece}) => !piece);
  const randomIndex = _.random(randomChess.length - 1);
  return randomChess[randomIndex].index;
}

function nextIsEmpty (currentIndex) {
  let nextIndex = 0;
  if (currentIndex >= data.dimension * data.dimension - 1) {
    nextIndex = 0;
    if (data.chess[nextIndex]) {
      nextIsEmpty(nextIndex);
    }
  }

}

function transform (num) {
  return {
    x: _.floor(num / data.dimension),
    y: num % data.dimension
  };
}

function isOver () {
  if (!data.chess.filter(({piece}) => !piece).length ) {
    alert('game over');
    return true;
  }
  return false;
}
