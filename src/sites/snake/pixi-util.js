export function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

