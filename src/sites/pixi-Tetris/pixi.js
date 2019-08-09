import * as PIXI from 'pixi.js'
import _ from 'lodash';
import one from './assets/one.png';
import store, {initStore} from './pixi-store';
import {keyboard, randomInt, strip, transform, chunk, setAnimation, hitTestRectangle, contain} from './pixi-util';

const tetris = {
  'Z': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  'S': [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}],
  'J': [{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}],
  'L': [{x: 0, y: 1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}],
  'T': [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  'I': [{x: 0, y: 1}, {x: 3, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  'O': [{x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}]
};

let app = null;

const game = {
  app: getApp,
  delay: 100,
  delayId: null
};

function getApp () {
  game.dpr = window.devicePixelRatio;
  game.width = document.getElementById(store.boxId).clientWidth * game.dpr;
  game.spriteWidth = strip(game.width / 10);
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
  makeTetris('S');
}

function play() {
  if (game.delayId) return;
  game.delayId = setTimeout(() => {
    game.delayId = null;
  }, game.delay);

  game.movingContainer.y += game.movingContainer.vy;
  let hit = checkHit();
  if (hit === 'bottom') {
    removeContainer();
    checkHasOneLine();
    makeTetris('O');
  }
  if (hit) {

  game.movingContainer.vy = 0;
  }
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

function makeTetris (name) {
  tetris[name].map(t => {
    return setupSprite({
      x: t.x * game.spriteWidth,
      y: t.y * game.spriteWidth,
      v: {
        vx: 0,
        vy: 0
      }
    })
  }).forEach(sprite => {
    game.movingContainer.addChild(sprite);
  });
  game.movingContainer.vy = game.speed;
  game.movingContainer.x = game.spriteWidth * 3;
  game.movingContainer.y = -game.spriteWidth;
}

function checkHasOneLine() {

  console.log(game.movingContainer)
}

function checkHit () {
  // remove
  let sprites = app.stage.children.filter(e => e.isSprite);
  if (sprites.length) {
    let xs = [...new Set(game.movingContainer.children.map(t => t.x + game.movingContainer.x))];
    console.log(xs);

    let allInX = sprites.filter(t => {
      return xs.includes(t.x)
    });
    if (allInX.length) {
      let hitSprites = xs.map(x =>
        _.first(_.sortBy(allInX.filter(sprite => sprite.x === x), ['y']))
      );
      let movingSprites = xs.map(x =>
        _.first(_.sortBy(game.movingContainer.children.filter(sprite => sprite.x + game.movingContainer.x === x), ['y']))
      );
        console.log(hitSprites)
        console.log(movingSprites)
      return hitMovingBottom(hitSprites, movingSprites);
    }
    return hitWithBottom();
  }
  return hitWithBottom();
}

function hitMovingBottom (hit, moving) {
  return hit.some(hitSprite => {
    let movingSprite = moving.find((sprite) => hitSprite.x === sprite.x + game.movingContainer.x);
    return hitTestRectangle(hitSprite, movingSprite)
  });
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
    app.stage.addChild(sprite);
  }
}

export default game;
