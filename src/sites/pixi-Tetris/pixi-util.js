import * as PIXI from 'pixi.js'

export const keyboard = (keyCode) => {
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

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const strip = (num, precision = 12) => {
  return +parseFloat(num.toPrecision(precision));
}

export const hitTestRectangle = (r1, r2, direction) => {
  if (direction === 'down') {
    return Math.abs(r2.y + r2.height - r1.y) <= 2;
  }
  if (direction === 'left') {
    return Math.abs(r2.x - r2.width - r1.x) <= 2;
  }
  if (direction === 'right') {
    return Math.abs(r2.x + r2.width - r1.x) <= 2;
  }
};

export const movingContainerToStaticContainer = (movingContainer, staticContainer) => {
    while(movingContainer.children[0]) {
    let sprite = movingContainer.children[0];
    sprite.y += movingContainer.y;
    sprite.x += movingContainer.x;
    sprite.tint = 0xFFFFFF;
    staticContainer.addChild(sprite);
  }
}

export const setupSprite = ({x, y, texture, spriteWidth}) => {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = strip(x);
  sprite.y = strip(y);
  sprite.width = spriteWidth;
  sprite.height = spriteWidth;
  return sprite;
}
