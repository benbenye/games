import * as PIXI from 'pixi.js'
import _ from 'lodash';
import one from './assets/one.png';
import store, {initStore} from './pixi-store';
import {keyboard, randomInt, strip, transform, chunk, setAnimation, hitTestRectangle, contain} from './pixi-util';

const tetris = [
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}],
  [{x: 0, y: 1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}],
  [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 0}, {x: 3, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
  [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}]
];

let app = null;

const game = {
  app: getApp,
  pause,
  isPause: false,
  delayId: null
};

function getApp () {
  initStore();
  game.dpr = window.devicePixelRatio;
  game.width = document.getElementById(store.boxId).clientWidth * game.dpr;
  game.spriteWidth = strip(game.width / 10);
  game.containerOffset = 3;
  game.speed = game.spriteWidth;
  game.movingContainer = new PIXI.Container();

  app = new PIXI.Application({
    width: this.width,
    height: this.width * 2,
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

  app.stage.addChild(game.movingContainer);

  app.loader
    .add([one])
    .on('progress', loadProgressHandler)
    .load(() => {
      createIdTexture();
      gameStart();
      let s = app.ticker.add(play);
      // s.minFPS = 0.5;
      // s.maxFPS = 0.5;
    });
}

function loadProgressHandler (loader, resources) {
  console.log("loading: " + resources.url);
  console.log("progress: " + loader.progress + "%");
}

function gameStart () {
  makeTetris(randomInt(0, tetris.length - 1))
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
  if (hit === 'bottom') {
    console.log(hit)
    removeContainer();
    checkHasOneLine();
    makeTetris(randomInt(0, tetris.length - 1))
  }
  if (hit === 'hit') {
    console.log(hit)
    removeContainer();
    checkHasOneLine();
    makeTetris(randomInt(0, tetris.length - 1))
  }
  game.movingContainer.y += game.movingContainer.vy;
}

function isGameOver() {
  return !!app.stage.children.filter(sprite => sprite.isSprite)
  .filter(sprite =>
    sprite.x >= game.spriteWidth * game.containerOffset && sprite.x * game.spriteWidth * (game.containerOffset + 4) && sprite.y <= 2
  ).length
}

function pause() {
  game.isPause = !game.isPause;
}

function createIdTexture () {
  game.texture = PIXI.Texture.from(one);
}

function setupSprite ({x, y}) {
  let sprite2 = new PIXI.Sprite(game.texture);
  sprite2.x = strip(x);
  sprite2.y = strip(y);
  sprite2.width = game.spriteWidth;
  sprite2.height = game.spriteWidth;
  sprite2.aid = _.uniqueId();
  return sprite2;
}

function makeTetris (index = 0) {
  tetris[index].slice(0, 4).map(t => {
    return setupSprite({
      x: t.x * game.spriteWidth,
      y: t.y * game.spriteWidth,
      v: {
        vx: 0,
        vy: 0
      },
      originX: _.last(tetris[index]).x,
      originY: _.last(tetris[index]).y
    })
  }).forEach(sprite => {
    game.movingContainer.addChild(sprite);
  });
  game.movingContainer.vy = game.speed;
  game.movingContainer.x = strip(game.spriteWidth * game.containerOffset);
  game.movingContainer.y = -2 * game.spriteWidth;
}

function checkHasOneLine() {

  console.log(game.movingContainer)
  console.log(app.stage.children)
}

function checkHit () {
  game.movingContainer.children.forEach(e => e.tint = 0xFFFFFF);
  let sprites = app.stage.children.filter(e => e.isSprite);
  if (sprites.length) {
    let xs = [...new Set(game.movingContainer.children.map(t => t.x + game.movingContainer.x))];
    let movingSprites = xs.map(x =>
      _.last(_.sortBy(game.movingContainer.children.filter(sprite => sprite.x + game.movingContainer.x === x), ['y']))
    );

    let allInX = sprites.filter(t =>
      xs.find(x => Math.abs(x - t.x) < 2)
    );

    if (allInX.length) {
      let hitSprites = movingSprites.map(movingSprite =>
         _.first(_.sortBy(allInX.filter(sprite =>
           Math.abs(sprite.x - movingSprite.x - game.movingContainer.x) < 2), ['y']))
      );

      return hitMovingBottom(hitSprites, movingSprites);
    }

    app.stage.children.filter(sprite => sprite.isSprite).forEach(sprite => sprite.tint = 0xFFFFFF);

    return hitWithBottom();
  }
  return hitWithBottom();
}

function hitMovingBottom (hit, moving) {
  app.stage.children.filter(sprite => sprite.isSprite).forEach(sprite => sprite.tint = 0xFFFFFF);
  if (game.movingContainer) {
    game.movingContainer.children.forEach(sprite => sprite.tint = 0xFFFFFF);
  }
  return moving.some(movingSprite => {
    if (!movingSprite) return false;
    let hitSprite = hit.find(sprite => sprite && Math.abs(movingSprite.x + game.movingContainer.x - sprite.x) < 2);
    if (!hitSprite) return false;
    store.guide && (hitSprite.tint = 0xFF0000);
    store.guide && (movingSprite.tint = 0x01FF00);
    return hitTestRectangle(hitSprite, {
      x: movingSprite.x + game.movingContainer.x,
      y: movingSprite.y + game.movingContainer.y,
      width: movingSprite.width,
      height: movingSprite.height
    })
  }) ? 'hit' : null;
}

function hitWithBottom () {
  return contain(game.movingContainer, {
    x: 0,
    y: 0,
    width: app.renderer.width,
    height: app.renderer.height
  });
}

function removeContainer () {
  while(game.movingContainer.children[0]) {
    let sprite = game.movingContainer.children[0];
    sprite.y += game.movingContainer.y;
    sprite.x += game.movingContainer.x;
    sprite.tint = 0xFFFFFF;
    app.stage.addChild(sprite);
  }
}

export default game;
