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

export function chunk (s, d) {
  let r = [[s[0]]];
  for (let i = 1; i < s.length; i++) {
    if (!s[i]) break;
    if (_.last(_.last(r))[d] === s[i][d]) {
      _.last(r).push(s[i]);
      continue;
    }
    r.push([s[i]]);
  }
  return r;
}

export function setAnimation (sprite, scaleX) {
  let i = 0;
  let op = 1;

  let o = setInterval(() => {
    i += scaleX * 0.09 * op;
    sprite.scale.set(strip(i), strip(i));
    sprite.visible = true;

    if(strip(i) >= scaleX * 1.3) {
      op = -1;
    }
    if (strip(i) <= scaleX && op === -1) {
      sprite.scale.set(scaleX, scaleX);
      clearInterval(o);
    }
  }, 12);
}
