import * as PIXI from 'pixi.js'
import logo from '../../assets/logo.png';
import number from './assets/2048.png';

let viewWidth = window.innerWidth * 0.8;
let dimension = 6;
let margin = 6;
let color = {
  n2: 0xEEE4DA,
  n4: 0xEDDFC7,
  n8: 0xF2B179,
  n16: 0xF69865,
  n32: 0xF67C5F,
  n64: 0xF5613C,
  n128: 0xEDCF72,
  n256: 0xEDCC61,
  n512: 0xEDC850,
  n1024: 0xE2B913,
  n2048: 0xEDC22E,
  n4096: 0x413E35
};

let app = new PIXI.Application({
  width: viewWidth,
  height: viewWidth
});

const pixi = {
  spriteWidth: viewWidth / dimension - 2 * margin,
  speed: 10,
  left: keyboard(37),
  up: keyboard(38),
  right: keyboard(39),
  down: keyboard(40),
  moveLeft,
  moveRight,
  moveDown,
  moveUp,
  initView,
  drawRect,
  drawRectSprite,
  sprites: []
}
export default pixi;
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
    .add([logo, number])
    .on('progress', loadProgressHandler)
    .load(start);
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
function drawRectSprite ({x, y}) {
  const spriteX = margin + (pixi.spriteWidth + 2 * margin) * x;
  const spriteY = margin + (pixi.spriteWidth + 2 * margin) * y;
  setupSprite({x: spriteX, y: spriteY});
}

function setupSprite ({x, y}) {
  let texture =app.loader.resources[number].texture;
  let rectangle = new PIXI.Rectangle(0, 0, 200, 200);
  texture.frame = rectangle;
  let sprite2 = new PIXI.Sprite(texture);
  sprite2.x = x;
  sprite2.vx = 0;
  sprite2.vy = 0;
  sprite2.y = y;
  sprite2.width = pixi.spriteWidth;
  sprite2.height = pixi.spriteWidth;
  pixi.sprites.push(sprite2);
  app.ticker.add(() => {move(sprite2)})
  app.stage.addChild(sprite2);
}

function loadProgressHandler (loader, resources) {
  console.log("loading: " + resources.url);

  console.log("progress: " + loader.progress + "%");
}

function move (sprite) {
sprite.x += sprite.vx;
sprite.y += sprite.vy;
  const right = viewWidth - pixi.spriteWidth - 2 * margin
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

function moveLeft () {
    pixi.sprites.forEach(sprite => {
      if (sprite.x > margin) {
          sprite.vx = -pixi.speed;
      }else {
        sprite.vx = 0;
      }
    })
}
function moveRight () {
  const right = viewWidth - pixi.spriteWidth - 2 * margin
    pixi.sprites.forEach(sprite => {
      if (sprite.x < right) {
        sprite.vx = pixi.speed;
      }else {
        sprite.vx = 0;
      }
    })
}
function moveDown () {
  const down = viewWidth - pixi.spriteWidth - 2 * margin
    pixi.sprites.forEach(sprite => {
      if (sprite.y > down) {
        sprite.vy = pixi.speed;
      }else {

        sprite.vy = 0;
      }
    })
}
function moveUp () {
    pixi.sprites.forEach(sprite => {
      if (sprite.y > margin) {
        sprite.vy = -pixi.speed;
      }else {
        sprite.vy = 0;
      }
    })
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
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
