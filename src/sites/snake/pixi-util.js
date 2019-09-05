export function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

export function transform (num, xCoo) {
  return {
    y: _.floor(num / xCoo),
    x: num % xCoo
  };
}
