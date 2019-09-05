import * as PIXI from 'pixi.js'
import _ from 'lodash';
import snakePng from './assets/snake.png';
import foodPng from './assets/food.png';
import store, {initStore} from './pixi-store';
import {strip, transform} from './pixi-util';

let app = null;
let snake = null;
let snakeContainer = null;
let food = null;
let foodContainer = null;
let head = null;

const game = {
  app: init,
  pause,
  isPause: false,
  delayId: null,
  directionControl: {
    left: horizontal(-1),
    right: horizontal(1),
    bottom: vertical(1),
    up: vertical(-1)
  }
};

function init () {
  initStore();
  game.dpr = window.devicePixelRatio;
  game.width = document.getElementById(store.boxId).clientWidth * game.dpr;
  game.spriteWidth = strip(game.width / 40);
  game.speed = game.spriteWidth ;

  app = new PIXI.Application({
    width: this.width,
    height: this.width * 0.75,
    transparent: true
  });
  document.getElementById(store.docId).replaceWith(app.view);

  app.renderer.view.id = store.docId;
  app.renderer.view.style.verticalAlign = 'top';
  app.renderer.view.style.transform = `scale(${1/game.dpr})`;
  app.renderer.view.style.transformOrigin = `0 0`;
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.top = '0'
  app.renderer.view.style.left = '0'

  snakeContainer = new PIXI.Container();
  foodContainer = new PIXI.Container();
  app.stage.addChild(snakeContainer);
  app.stage.addChild(foodContainer);
  snake = snakeContainer.children;
  food = foodContainer.children;

  app.loader
    .add([snakePng, foodPng])
    .on('progress', loadProgressHandler)
    .load(() => {
      createIdTexture();
      gameStart();
      app.ticker.add(play);
    });
}

function loadProgressHandler (loader, resources) {
  console.log("loading: " + resources.url);
  console.log("progress: " + loader.progress + "%");
}

function gameStart () {
  initSnake();
  randomFood();
}

function play() {
  if (game.isPause) return;

  if (isGameOver()) {
    store.isGameOver = true;
    return;
  }
  let hit = checkHit();
  if (hit || snake.length >= 30 * 40 -1) {
    if (hit === 'food') {
      foodContainer.removeChildren();
      addSnakeTail();
      if (snake.length >= 30 * 40 -1) {
        game.isGameOver = true;
        return;
      }
      randomFood();
      return;
    }
    game.isGameOver = true;
    return;
  }
  if (game.delayId) return;
  game.delayId = setTimeout(() => {
    game.delayId = null;
  }, store.delay);

  // changeDirection();
  moveForward();
  // updateSprite();

}

function moveForward(noHead) {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i-1].x;
    snake[i].y = snake[i-1].y;
    snake[i].vx = snake[i-1].vx;
    snake[i].vy = snake[i-1].vy;
  }
  if (!noHead) {
    head.x += head.vx;
    head.y += head.vy;
  }
}

function isGameOver() {
  return game.isGameOver;
}

function pause() {
  game.isPause = !game.isPause;
}

function createIdTexture () {
  game.snakeTexture = PIXI.Texture.from(snakePng);
  game.foodTexture = PIXI.Texture.from(foodPng);
}

function setupSprite ({x, y, v}) {
  let sprite2 = new PIXI.Sprite(game.snakeTexture);
  sprite2.x = strip(x * game.spriteWidth);
  sprite2.y = strip(y * game.spriteWidth);
  sprite2.vx = v.vx;
  sprite2.vy = v.vy;
  sprite2.width = game.spriteWidth;
  sprite2.height = game.spriteWidth;
  return sprite2;
}

function setupFoodSprite ({x, y}) {
  let sprite2 = new PIXI.Sprite(game.foodTexture);
  sprite2.x = strip(x * game.spriteWidth);
  sprite2.y = strip(y * game.spriteWidth);
  sprite2.width = game.spriteWidth;
  sprite2.height = game.spriteWidth;
  return sprite2;
}


function randomFood () {
  const index = getOnlyRandomIndex(_.random(1199));
  foodContainer.addChild(setupFoodSprite({...transform(index, 40)}));
  food = foodContainer.children[0]
}

function getOnlyRandomIndex (index) {
  if (checkIsRepeat(index)) {
    index = ++index % (30 * 40 - 1);
    return getOnlyRandomIndex(index);
  }
  return index;
}

function checkIsRepeat(i) {
  let {x, y} = transform(i, 40);
  return snake.some(one => {
    return Math.abs(one.x - x * game.spriteWidth) < 1 && Math.abs(one.y - y * game.spriteWidth) < 1
  });
}

function initSnake () {
  // start in 3 * 4
  while (snake.length < 10) {
    snakeContainer.addChild(setupSprite({
      x: 12 - snake.length,
      y: 4,
      v: {
        vx: game.speed,
        vy: 0
      }
    }))
  }
  head = snake[0];
}

function addSnakeTail() {
  const tail = _.last(snake);
  snakeContainer.addChild(setupSprite({
    x: tail.x - tail.vx,
    x: tail.x - tail.vy,
    v: {
      vx: tail.vx,
      vy: tail.vy
    }
  }))
}

function checkHit () {
  if (head.x < 0 || head.y < 0 || head.x > app.view.width || head.y > app.view.height ) {
    return 'hitWall';
  }
  if (checkHitSelf()) {
    return 'hitSelf';
  }
  if (eatFood()) {
    return 'food';
  }
  return null;
}

function eatFood() {
  if (Math.abs(food.x - head.x) <= game.spriteWidth && Math.abs(food.y - head.y) <= game.spriteWidth) {
    return true;
  }
  return false;
}

function checkHitSelf () {
  let hit = false;
  for (let i = 1; i < snake.length - 1; i++) {
    let one = snake[i];
    if (Math.abs(one.x - head.x) < 1 && Math.abs(one.y - head.y) < 1) {
      hit = true;
      break;
    }
  }
  return hit;
}

function horizontal(direction) {
  return () => {
    if (head.vx) {
      return;
    }
    game.isPause = true;
    head.vx = game.speed * direction;
    head.vy = 0;
    game.isPause = false;
  }
}

function vertical(direction) {
  return () => {
    if (head.vy) {
      return;
    }
    game.isPause = true;
    head.vy = game.speed * direction;
    head.vx = 0;
    game.isPause = false;
  }
}

export default game;
