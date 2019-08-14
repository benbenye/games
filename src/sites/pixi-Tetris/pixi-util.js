export function keyboard(keyCode) {
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

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

export function hitTestRectangle(r1, r2, direction) {
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


export function contain(sprite, container) {

  let collision = null;

  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    sprite.vy = 0;
    collision = "bottom";
  }

  return collision;
}
