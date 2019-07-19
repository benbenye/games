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

function init (n = 4, touch) {
  data.dimension = n;
  initChess();
  pixi.initView(n, function (){
    start(touch)
  });
}
function start (touch){
  data.chess.forEach(({piece}, index) => {
    pixi.drawRect(transform(index))
  })
  // initPieces();
  // initPieces();
  // initPieces();
  // initPieces();
  // initPieces();
  // initPiecesByMe(0);
  // initPiecesByMe(1);
  // initPiecesByMe(2);
  // initPiecesByMe(3);
  // initPiecesByMe(4);
  initPiecesByMe(10);
  initPiecesByMe(11);
  initPiecesByMe(12);
  initPiecesByMe(13);
  // initPiecesByMe(14);
  initPiecesByMe(15);
  initPiecesByMe(16);
  initPiecesByMe(17);
  initPiecesByMe(18);
  moveHandler(touch);
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

  pixi.drawRectSprite({...transform(index), value: 2});
}

function initPiecesByMe(index) {
  data.chess.splice(index, 1, {piece: 2, index});

  pixi.drawRectSprite({...transform(index), value: 2});
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

function moveHandler (touch) {
  if (touch) {
    touch
      .on('swipe', (e) => {
        pixi.moveSprite(e.offsetDirection);
      });
  }
  pixi.left.release = () => {
    pixi.moveSprite(2);
  }
  pixi.right.release = () => {
    pixi.moveSprite(4);
  }
  pixi.down.release = () => {
    pixi.moveSprite(16);
  }
  pixi.up.release = () => {
    pixi.moveSprite(8);
  }
}

function removeSprite () {
  pixi.removeSprite();
}


