import _ from 'lodash';
import pixi from './pixi';

export const data = {
  dimension: 0,
  currentScore: 0,
  highestScore: 0,
  chess: [],
  init,
  restart,
  removeSprite
}

function init (n = 4) {
  data.dimension = n;
  initChess();
  pixi.initView(n, start);
}
function start (){
  data.chess.forEach(({piece}, index) => {
    pixi.drawRect(transform(index))
  })
  // initPieces();
  // initPieces();
  // initPieces();
  initPiecesByMe(0);
  initPiecesByMe(1);
  initPiecesByMe(2);
  // initPiecesByMe(12);
  // initPiecesByMe(13);
  // initPiecesByMe(14);
  // initPiecesByMe(16);
  // initPiecesByMe(17);
  // initPiecesByMe(18);
  moveHandler();
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

  pixi.drawRectSprite(transform(index));
}

function initPiecesByMe(index) {
  data.chess.splice(index, 1, {piece: 2, index});

  pixi.drawRectSprite(transform(index));
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
    y: _.floor(num / data.dimension),
    x: num % data.dimension
  };
}

function isOver () {
  if (!data.chess.filter(({piece}) => !piece).length ) {
    alert('game over');
    return true;
  }
  return false;
}

function moveHandler () {
  pixi.left.release = () => {
    pixi.moveSprite('l');
  }
  pixi.right.release = () => {
    pixi.moveSprite('r');
  }
  pixi.down.release = () => {
    pixi.moveSprite('d');
  }
  pixi.up.release = () => {
    pixi.moveSprite('u');
  }
}

function removeSprite () {
  pixi.removeSprite();
}
