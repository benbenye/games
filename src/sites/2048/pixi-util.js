import BezierEasing from 'bezier-easing';

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

const easing = new BezierEasing(0.25,1,0.25,1);

export function setAnimation (sprite, scaleX) {
  let i = scaleX * 0.2;

  let o = setInterval(() => {
    i += scaleX * 0.09;
    sprite.scale.set(strip(easing(i)), strip(easing(i)));

    if(strip(easing(i)) >= scaleX * 1.1) {
      sprite.scale.set(scaleX, scaleX);
      clearInterval(o);
    }
  }, 10);
}
