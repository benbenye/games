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

export function transform (num, dimension) {
  return {
    y: _.floor(num / dimension),
    x: num % dimension
  };
}
