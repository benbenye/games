import * as PIXI from 'pixi.js'
import _ from 'lodash';
import one from './assets/one.png';
import store, {initStore} from './pixi-store';
import {keyboard, randomInt, strip, transform, chunk, setAnimation, hitTestRectangle} from './pixi-util';

const tetris = {
  'Z': [{x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
  'S': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 2, y: -1}, {x: 1, y: 0}],
  'J': [{x: 0, y: 0}, {x: 0, y: -1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}],
  'L': [{x: 0, y: 0}, {x: 2, y: -1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}],
  'T': [{x: 0, y: 0}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
  'I': [{x: 0, y: 0}, {x: 3, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
  'O': [{x: 1, y: -1}, {x: 2, y: -1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}]
};

const game = {
  app: getApp,
};

function getApp () {

  game.width = document.getElementById(store.boxId).clientWidth;
  game.spriteWidth = strip(game.width / 10);
  game.dpr = window.devicePixelRatio;
  let app = new PIXI.Application({
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


  app.loader
    .add([one])
    .on('progress', loadProgressHandler)
    .load(() => {
      // createIdTexture();
      gameStart();
      // app.ticker.add(play);
    });
  return app;
}

function loadProgressHandler (loader, resources) {
  console.log("loading: " + resources.url);
  console.log("progress: " + loader.progress + "%");
}

function gameStart () {
  game.app.stage.addChild(makeTetris())
}

function setupSprite ({x, y, v}) {
  let sprite2 = new PIXI.Sprite(one);
  sprite2.x = strip(x);
  sprite2.x1 = sprite2.x * 2;
  sprite2.vx = v.vx;
  sprite2.vy = v.vy;
  sprite2.y = strip(y);
  sprite2.y1 = sprite2.y * 2;
  sprite2.isNew = true;
  sprite2.width = game.spriteWidth;
  sprite2.height = game.spriteWidth;
  sprite2.anchor.set(0.5, 0.5);
  sprite2.aid = _.uniqueId();
  return sprite2;
}

function makeTetris () {
  let container = new PIXI.Container();
  tetris['I'].map(t => {
    return setupSprite({
      x: t.x + 5,
      y: t.y + 5,
      v: {
        vx: 0,
        vy: 0
      }
    })
  }).forEach(sprite => {
    container.addChild(sprite);
  });
  return container;
}

export default game;
