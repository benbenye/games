import _ from 'lodash';
import * as PIXI from 'pixi.js'
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
  spriteWidth: viewWidth / dimension - 2 * margin,
  speed: 20,
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),
  isMoving: false,
  moveSprite,
  initView,
  drawRect,
  drawRectSprite,
  removeSprite,
  sprites: [],
  textures: [],
  moveDirection: 0
}
export default pixi;
window.app = app;
window.pixi = pixi;

function initSize (n) {
  viewWidth = window.innerWidth * 0.8;
  dimension = n;
  pixi.spriteWidth = viewWidth / dimension - 2 * margin;
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

function drawRect ({x, y}) {
  const rectangle = new PIXI.Graphics();
  const spriteX = margin + (pixi.spriteWidth + 2 * margin) * x;
  const spriteY = margin + (pixi.spriteWidth + 2 * margin) * y;
  rectangle.beginFill(0xCCC0B3);
  rectangle.drawRoundedRect(spriteX, spriteY, pixi.spriteWidth, pixi.spriteWidth, 5);
  rectangle.endFill();
  app.stage.addChild(rectangle)
}
function drawRectSprite ({x, y, value}) {
  const spriteX = margin + (pixi.spriteWidth + 2 * margin) * x;
  const spriteY = margin + (pixi.spriteWidth + 2 * margin) * y;
  setupSprite({
    x: spriteX,
    y: spriteY,
    value
  });
}

function setupSprite ({x, y, value, v = {vx:0,vy:0}}) {
  let sprite2 = new PIXI.Sprite(pixi.textures[`n${value}.png`]);
  sprite2.x = x;
  sprite2.vx = v.vx;
  sprite2.vy = v.vy;
  sprite2.y = y;
  sprite2.value = value;
  sprite2.isNew = true;
  sprite2.width = pixi.spriteWidth;
  sprite2.height = pixi.spriteWidth;
  pixi.sprites.push(sprite2);
  app.stage.addChild(sprite2);
}

function loadProgressHandler (loader, resources) {
  console.log("loading: " + resources.url);
  console.log("progress: " + loader.progress + "%");
}

function findLeftHitSprite(x, y) {
  return _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.y === y),
    [(s) => -s.x])
  .find((sprite) => sprite.x < x );
}
function findRightHitSprite(x, y) {
  return _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.y === y),
    [(s) => s.x])
  .find((sprite) => sprite.x > x );
}
function findUpHitSprite(x, y) {
  return _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.x === x),
    [(s) => -s.y])
  .find((sprite) => sprite.y < y );
}
function findDownHitSprite(x, y) {
  return _.sortBy(
    pixi.sprites
      .filter(sprite => sprite.x === x),
    [(s) => s.y])
  .find((sprite) => sprite.y > y );
}

function play () {
  const right = viewWidth - pixi.spriteWidth - margin
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
        console.log('hit')
        if (
          sprite.value === hitSprite.value &&
          !hitSprite.isNew &&
          (!hitSprite.vx || !hitSprite.vy)
          ) {
            console.log('merge')
          hitMerge(hitSprite, sprite);
        }else {
          // the diffrent sprite should be the same speed
          if (pixi.moveDirection === 2) {
            sprite.x = hitSprite.x + pixi.spriteWidth + margin * 2;
            sprite.vx = hitSprite.vx;
          }
          if (pixi.moveDirection === 4) {
            sprite.x = hitSprite.x - pixi.spriteWidth - margin * 2;
            sprite.vx = hitSprite.vx;
          }
          if (pixi.moveDirection === 8) {
            sprite.y = hitSprite.y + pixi.spriteWidth + margin * 2;
            sprite.vy = hitSprite.vy;
          }
          if (pixi.moveDirection === 16) {
            sprite.y = hitSprite.y - pixi.spriteWidth - margin * 2;
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
  if (pixi.sprites.every(sprite =>
    sprite.vx === 0 && sprite.vy === 0
  )) {
    // one step is over
    randomTwoSprites();
  }
}

function removeSprite () {
  app.stage.removeChild(pixi.sprites[0])
}

function moveSprite (direction) {
  pixi.moveDirection = direction;
  const right = viewWidth - pixi.spriteWidth - margin
  pixi.sprites.forEach((sprite, i) => {
    sprite.isNew = false;
    if (direction === 2) {
      if (sprite.x > margin) {
        sprite.vx = -pixi.speed;
      }else {
        sprite.vx = 0;
      }
    }
    if (direction === 4) {
      if (sprite.x < right) {
        sprite.vx = pixi.speed;
      }else {
        sprite.vx = 0;
      }
    }
    if (direction === 8) {
      if (sprite.y > margin) {
        sprite.vy = -pixi.speed;
      }else {
        sprite.vy = 0;
      }
    }
    if (direction === 16) {
      if (sprite.y < right) {
        sprite.vy = pixi.speed;
      }else {
        sprite.vy = 0;
      }
    }
  });
}

function hitMerge(s1, s2) {
  setupSprite({x: s1.x, y: s1.y, value: s1.value * 2, v: {vx:s1.vx, vy:s1.vy}});

  app.stage.removeChild(s1)
  app.stage.removeChild(s2)
  pixi.sprites.splice(pixi.sprites.findIndex(sprite =>
      sprite.x === s1.x && sprite.y === s1.y
  ), 1)
  pixi.sprites.splice(pixi.sprites.findIndex(sprite =>
      sprite.x === s2.x && sprite.y === s2.y
  ), 1)
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.release = undefined;

  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.release) key.release();
    }
    event.preventDefault();
  };

  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
