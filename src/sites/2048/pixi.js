import _ from 'lodash';
import * as PIXI from 'pixi.js'
import {hitTestRectangle, keyboard, randomInt, strip, transform} from './pixi-util.js';
import logo from '../../assets/logo.png';
import number from './assets/number.png';

let viewWidth = window.innerWidth * 0.8;
let dimension = 6;
let margin = 6;
let app = new PIXI.Application({
  width: viewWidth,
  height: viewWidth
});
const pixi = {
  spriteWidth: strip(viewWidth / dimension - 2 * margin),
  speed: 20,
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),
  isMoving: false,
  moveSprite,
  initView,
  drawRectView,
  drawRectSprite,
  sprites: [],
  mergeSprites: [],
  textures: [],
  moveDirection: 0,
  moveSteps: [],
  rectContainer: null, //for rect container
  spriteContainer: null, //for sprite container
  isReserve: false//精灵顺序是否反序
}

export default pixi;
window.pixi = pixi;

function initSize (n) {
  viewWidth = window.innerWidth * 0.8;
  dimension = n;
  pixi.spriteWidth = strip(viewWidth / dimension - 2 * margin);
}
function initView (n, start) {
  initSize(n);
  app = new PIXI.Application({
    width: viewWidth,
    height: viewWidth
  });
  document.getElementById('pixi').replaceWith(app.view);

  app.renderer.view.id = 'pixi';
  app.renderer.backgroundColor = 0xBBADA0;
  app.renderer.view.style.margin = 0;
  app.renderer.view.style.padding = 0;

  app.loader
    .add([logo, number, {name: 'numberJson', url: '/img/2048/number.json'}])
    .on('progress', loadProgressHandler)
    .load(() => {
      createIdTexture();
      start();
      app.ticker.add(play);
    });
}

function createIdTexture () {
  pixi.textures = app.loader.resources['numberJson'].textures;
}

function drawRectView (chess) {
  chess.forEach((e, index) => {
    drawRect(transform(index, dimension));
  });
  app.stage.addChild(pixi.rectContainer);
  app.stage.addChild(pixi.spriteContainer);
  pixi.sprites = app.stage.children[1].children;
  window.sprites = app.stage.children[1];
}

function drawRect ({x, y}) {
  const rectangle = new PIXI.Graphics();
  const spriteX = strip(margin + (pixi.spriteWidth + 2 * margin) * x);
  const spriteY = strip(margin + (pixi.spriteWidth + 2 * margin) * y);
  rectangle.beginFill(0xCCC0B3);
  rectangle.drawRoundedRect(spriteX, spriteY, pixi.spriteWidth, pixi.spriteWidth, 5);
  rectangle.endFill();
  app.stage.addChild(rectangle)
}
function drawRectSprite ({x, y, value}) {
  const spriteX = strip(margin + (pixi.spriteWidth + 2 * margin) * x);
  const spriteY = strip(margin + (pixi.spriteWidth + 2 * margin) * y);
  setupSprite({
    x: spriteX,
    y: spriteY,
    value
  });
}

function setupSprite ({x, y, value, v = {vx:0,vy:0}}) {
  let sprite2 = new PIXI.Sprite(pixi.textures[`n${value}.png`]);
  // let container = new PIXI.Container();
  sprite2.x = strip(x);
  sprite2.vx = v.vx;
  sprite2.vy = v.vy;
  sprite2.y = strip(y);
  sprite2.value = value;
  sprite2.isNew = true;
  sprite2.width = pixi.spriteWidth;
  sprite2.height = pixi.spriteWidth;
  // if (v.vx || v.vy) {
  //   console.log('spliceS1')
  //   pixi.sprites.splice(pixi.sprites.findIndex(s => s.x === sprite2.x && s.y === sprite2.y), 0, sprite2);
  // }
  // container.addChild(sprite2);
  pixi.sprites.push(sprite2);
  app.stage.addChild(sprite2);
}

function loadProgressHandler (loader, resources) {
  console.log("loading: " + resources.url);
  console.log("progress: " + loader.progress + "%");
}

function findLeftHitSprite(x, y) {
  let hitSprite = _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.y === y),
    [(s) => -s.x])
  .find((sprite) => sprite.x < x );

  if (hitSprite) {
    return !hitSprite.hasHitSprite && hitSprite;
  }
  return hitSprite;
}
function findRightHitSprite(x, y) {
  let hitSprite = _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.y === y),
    [(s) => s.x])
  .find((sprite) => sprite.x > x );
  if (hitSprite) {
    return !hitSprite.hasHitSprite && hitSprite;
  }
  return hitSprite;
}
function findUpHitSprite(x, y) {
  let hitSprite = _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.x === x),
    [(s) => -s.y])
  .find((sprite) => sprite.y < y );
  if (hitSprite) {
    return !hitSprite.hasHitSprite && hitSprite;
  }
  return hitSprite;
}
function findDownHitSprite(x, y) {
  let hitSprite = _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.x === x),
    [(s) => s.y])
  .find((sprite) => sprite.y > y );
  if (hitSprite) {
    return !hitSprite.hasHitSprite && hitSprite;
  }
  return hitSprite;
}

function play () {
  if (pixi.sprites.every(sprite => {
    return sprite.vx === 0 && sprite.vy === 0
  })) {
    // nothing can be moved

    // one step is over
    initRandomSprite();
  }
  const right = strip(viewWidth - pixi.spriteWidth - margin);
  pixi.sprites.forEach((sprite, i) => {
    sprite.x += sprite.vx;
    sprite.y += sprite.vy;
    let hitSprite = null;
    if (pixi.moveDirection === 2) {
      hitSprite = findLeftHitSprite(sprite.x, sprite.y);
    }
    if (pixi.moveDirection === 4) {
      hitSprite = findRightHitSprite(sprite.x, sprite.y);
    }
    if (pixi.moveDirection === 8) {
      hitSprite = findUpHitSprite(sprite.x, sprite.y);
    }
    if (pixi.moveDirection === 16) {
      hitSprite = findDownHitSprite(sprite.x, sprite.y);
    }
    if (hitSprite) {
      if (hitTestRectangle(sprite, hitSprite)) {
        if (
          sprite.value === hitSprite.value &&
          !hitSprite.isNew &&
          !sprite.isNew &&
          ((sprite.vx && !hitSprite.vx) || (sprite.vy && !hitSprite.vy))
          ) {
            console.log(`will be push in hitMerge arr s1:${sprite.aid}, x: ${sprite.x}, y: ${sprite.y}, value: ${sprite.value}, vx: ${sprite.vx}, vy: ${sprite.vy}`);
            console.log(`will be push in hitMerge arr s2:${hitSprite.aid}, x: ${hitSprite.x}, y: ${hitSprite.y}, value: ${hitSprite.value}, vx: ${hitSprite.vx}, vy: ${hitSprite.vy}`);
            sprite.hasHitSprite = true;
            pixi.mergeSprites.push({s1: sprite, s2: hitSprite});
        }else {
          if (pixi.moveDirection === 2) {
            sprite.x = strip(hitSprite.x + pixi.spriteWidth + margin * 2);
            sprite.vx = hitSprite.vx;
          }
          if (pixi.moveDirection === 4) {
            sprite.x = strip(hitSprite.x - pixi.spriteWidth - margin * 2);
            sprite.vx = hitSprite.vx;
          }
          if (pixi.moveDirection === 8) {
            sprite.y = strip(hitSprite.y + pixi.spriteWidth + margin * 2);
            sprite.vy = hitSprite.vy;
          }
          if (pixi.moveDirection === 16) {
            sprite.y = strip(hitSprite.y - pixi.spriteWidth - margin * 2);
            sprite.vy = hitSprite.vy;
          }
        }
      }
    } else {
      if (sprite.x < margin) {
        sprite.x = margin;
        sprite.vx = 0;
      }
      if (sprite.x > right) {
        sprite.x = right;
        sprite.vx = 0;
      }
      if (sprite.y > right) {
        sprite.y = right;
        sprite.vy = 0;
      }
      if (sprite.y < margin) {
        sprite.y = margin;
        sprite.vy = 0;
      }

    }
  });
  pixi.mergeSprites.forEach(merge => {
    console.log(`foreach hitMerge arr s1:${merge.s1.aid}, x: ${merge.s1.x}, y: ${merge.s1.y}, value: ${merge.s1.value}`);
    console.log(`foreach hitMerge arr s2:${merge.s2.aid}, x: ${merge.s2.x}, y: ${merge.s2.y}, value: ${merge.s2.value}`);
    hitMerge(merge.s1, merge.s2);
  });
  pixi.mergeSprites = [];
}

function initRandomSprite () {
  if (pixi.isInitRandomSprite) return;
  pixi.isInitRandomSprite = true;
  let index = randomInt(0, dimension * dimension - 1)
  pixi.randomSpriteIndex = index;

  index = getOnlyRandomIndex(index);
  pixi.drawRectSprite({...transform(index, dimension), value: 2})
}

function getOnlyRandomIndex(index) {
  const isRepeat = checkIsRepeat(index);
  if (isRepeat) {
    index += 1;
    index = index % (dimension * dimension - 1);
    if (pixi.randomSpriteIndex === index) {
      // game over
      alert('game over');
      return false;
    }
    return getOnlyRandomIndex(index);
  }
  return index;
}

function checkIsRepeat(index) {
  const {x, y} = transform(index, dimension);
  // judge is repeat
  const spriteX = strip(margin + (pixi.spriteWidth + 2 * margin) * x);
  const spriteY = strip(margin + (pixi.spriteWidth + 2 * margin) * y);
  return pixi.sprites.find(sprite => Math.abs(sprite.x - spriteX) < 1 && Math.abs(sprite.y - spriteY) < 1);

}

function moveSprite (direction) {
  pixi.isInitRandomSprite = false;
  pixi.moveDirection = direction;
  pixi.moveSteps.push(direction);
  pixi.sprites.forEach(s => s.isNew = false);
  console.warn(`方向：${direction}`);
  if (
    (pixi.isReserve && (direction === 2 || direction === 8)) ||
    (!pixi.isReserve && (direction === 4 || direction === 16))
    ) {
      pixi.sprites.reverse();
      pixi.isReserve = true;
    } else {
      pixi.isReserve = false;
    }
  pixi.sprites.forEach(sprite => {
    sprite.isNew = false;
    if (direction === 2) {
      sprite.vx = -pixi.speed;
    }
    if (direction === 4) {
      sprite.vx = pixi.speed;
    }
    if (direction === 8) {
      sprite.vy = -pixi.speed;
    }
    if (direction === 16) {
      sprite.vy = pixi.speed;
    }
  });
}

function hitMerge(s1, s2) {
  // s1 is the current sprite
  // s2 is the hit sprite
  console.log(`hitMerge-s1: aid: ${s1.aid}, x: ${s1.x}, y: ${s1.y}, value: ${s1.value}`)
  console.log(`hitMerge-s2: aid: ${s2.aid}, x: ${s2.x}, y: ${s2.y}, value: ${s2.value}`)
  setupSprite({x: s1.x, y: s1.y, value: s1.value * 2, v: {vx:s1.vx, vy:s1.vy}});
  s1.visible = false;
  s2.visible = false;
  let aid1 = app.stage.children[1].removeChild(s1)
  console.log(`removeChild-s1: aid: ${aid1 && aid1.aid}`);
  let aid2 = app.stage.children[1].removeChild(s2)
  console.log(`removeChild-s2: aid: ${aid2 && aid2.aid}`);
}
