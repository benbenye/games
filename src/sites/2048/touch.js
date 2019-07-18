import Hammer from 'hammerjs';

export function TouchDirection (square) {
  const manager = new Hammer.Manager(square);

  manager.add(new Hammer.Swipe())

  manager.on('swipe', (e) => {
    e.target.innerText = e.offsetDirection;
  })
}
