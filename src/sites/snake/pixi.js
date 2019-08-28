import * as PIXI from 'pixi.js'
import _ from 'lodash';
import snake from './assets/snake.png';
import food from './assets/food.png';
import store, {initStore} from './pixi-store';
import {strip} from './pixi-util';

let app = null;
let sprites = null;
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
  sprites = app.stage.children;

  app.loader
    .add([snake, food])
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
  console.log(app)
  console.log(game)
}

function play() {
  if (game.delayId) return;
  game.delayId = setTimeout(() => {
    game.delayId = null;
  }, store.delay);

  if (game.isPause) return;

  if (isGameOver()) {
    store.isGameOver = true;
    return;
  }
  let hit = checkHit();

  if (hit) {
    game.isGameOver = true;
    return;
  }
  // changeDirection();
  moveForward();
  // updateSprite();

}

function moveForward(noHead) {
  for (let i = sprites.length - 1; i > 0; i--) {
    sprites[i].x = sprites[i-1].x;
    sprites[i].y = sprites[i-1].y;
    sprites[i].vx = sprites[i-1].vx;
    sprites[i].vy = sprites[i-1].vy;
  }
  if (!noHead) {
    head.x += head.vx;
    head.y += head.vy;
  }
}

function changeDirection() {
  let spriteA = head;
  sprites.forEach((spriteB, i) => {
    // if (i===0) return false;
    console.log(`i:${i}, x: ${spriteB.x}, y: ${spriteB.y}`)
    if (spriteA.vx === spriteB.vx && spriteA.vy === spriteB.vy) return false;
    spriteB.vy = spriteA.vy;
    spriteB.vx = spriteA.vx;
    spriteA = spriteB;
    return true;
  });
}


function isGameOver() {
  return game.isGameOver;
}

function pause() {
  game.isPause = !game.isPause;
}

function createIdTexture () {
  game.texture = PIXI.Texture.from(snake);
}

function setupSprite ({x, y, v}) {
  let sprite2 = new PIXI.Sprite(game.texture);
  sprite2.x = strip(x * game.spriteWidth);
  sprite2.y = strip(y * game.spriteWidth);
  sprite2.vx = v.vx;
  sprite2.vy = v.vy;
  sprite2.width = game.spriteWidth;
  sprite2.height = game.spriteWidth;
  return sprite2;
}

function makeOneSnake ({x, y}) {
  let sprite = setupSprite({
    x: x * game.spriteWidth,
    y: y * game.spriteWidth,
    v: {
      vx: 0,
      vy: 0
    }
  });
  game.movingContainer.addChild(sprite);
  game.movingContainer.vy = game.speed;
  if (typeof index === 'number') {
    game.movingContainer.x = strip(game.spriteWidth * game.containerOffset);
    game.movingContainer.y = -2 * game.spriteWidth;
  }
  game.isDowning = false;
  game.movingContainer.idName = index;
}

function initSnake () {
  // start in 3 * 4
  while (sprites.length < 10) {
    app.stage.addChild(setupSprite({
      x: 13 - sprites.length,
      y: 4,
      v: {
        vx: game.speed,
        vy: 0
      }
    }))
  }
  head = sprites[0];
}

function checkHit () {
  if (head.x < 0 || head.y < 0 || head.x > app.view.width || head.y > app.view.height ) {
    return 'hitWall';
  }
  if (0) {
    return 'hitSelf';
  }
  return null;
}

function horizontal(direction) {
  return () => {
    console.log(head.vy)
    if (head.vx) {
      return;
    }
    game.isPause = true;
    head.vx = game.speed * direction;
    // head.x += head.vx;
    // head.y -= head.vy;
    head.vy = 0;
    // moveForward(true);
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
    // head.y += head.vy;
    // head.x -= head.vx;
    head.vx = 0;
    // moveForward(true);
    game.isPause = false;
  }
}

export default game;
