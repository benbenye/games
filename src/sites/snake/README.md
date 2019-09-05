## Snake
Imitate the classic game snake in Nokia.    

### GIF

<img src="https://mmbiz.qpic.cn/mmbiz_gif/07qFzkU6Kn4HNFXI0KTiaCMZkian3MWgvgr3yUdYDlcHloF2WlZqFVfk7cVVxSicibTibBAgicOS06nuEezgT3hU5ZVg/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1" alt="snake swing">

When I wrote about the snake, I went through a lot of documentation. And I found there was nothing about the snake's rules. But some interesting about the life.    

>和别的游戏不同，贪食蛇是一个悲剧性的游戏。许多电子游戏都是打通关打到底，游戏操作者以胜利而告终。而贪食蛇的结局却是死亡。不管你玩得多么纯熟，手艺多么高超，你最终听到的都是小蛇那一声惨叫。当手机上的小蛇越长越长，积分越来越高的时候，死亡也就越来越近。那时候忙的不是为了吃蛋长身体，而是为了避免撞墙。你会发现你穷于应付，四处奔忙。树高风摧，福兮祸倚，这不是宿命又是什么？


>“贪食蛇”，要命的就在一个“贪”字上。所以，有时候真的需要及时收手，不要逼人太甚。如果没有余地，就算你的手再快，面临的结局也是——崩盘。

emmmm... I cound not to translate upon the content.     

But I think that if you don't want to the game becomes tragedy , you can change the rules of the game. 

### snake init

It will init a snake with 10 length in the beginning of the snake game. And made the head of the snake at the first of snake. So you can see that for cycles with reverse order.    

``` javascript 
function initSnake () {
  // start in 3 * 4
  while (snake.length < 10) {
    snakeContainer.addChild(setupSprite({
      x: 12 - snake.length,
      y: 4,
      v: {
        vx: game.speed,
        vy: 0
      }
    }))
  }
  head = snake[0];
}
```

### head hit test function

The head of snake is at the first all the time. The other blocks of the snake body are always repeat the head's trajectory.

There are there kinds of collisions.

- walls
- oneself 
- food

``` javascript 
function checkHitSelf () {
  let hit = false;
  for (let i = 1; i < snake.length - 1; i++) {
    let one = snake[i];
    if (Math.abs(one.x - head.x) < 1 && Math.abs(one.y - head.y) < 1) {
      hit = true;
      break;
    }
  }
  return hit;
}
```

### the control of speed of snake

``` javascript
if (game.delayId) return;
game.delayId = setTimeout(() => {
  game.delayId = null;
}, store.delay);
```


### moveForward

The most complicated logic is the `moveForward`. at the first I wanted to use the head of the snake to make the move forward. All blocks of the snake except the head will repeat the head. But there were some problems to recored some situations. Especially, the turn corners need to recored more information with direction, speed, etc. In a word, it will be difficult.     

At this point, the `second brother` will come on the stage. He gave me the suggestion is that use the tail of the snake will be easier. 

>The following node repeats the previous node.

All problems solved in a single sentence. 

```javascript
function moveForward() {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i-1].x;
    snake[i].y = snake[i-1].y;
    snake[i].vx = snake[i-1].vx;
    snake[i].vy = snake[i-1].vy;
  }
  head.x += head.vx;
  head.y += head.vy;
}
```

### the direction of the snake

<img src="https://mmbiz.qpic.cn/mmbiz_jpg/07qFzkU6Kn56yfeC9gYM24V4ZLznicjgx0jOXKH7dBoMstFgFy9z7JrYMicpFa9rWdXuW2S7Ha6nEgRdvUxkaDiaw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">

```javascript
function horizontal(direction) {
  return () => {
    if (head.vx) {
      return;
    }
    game.isPause = true;
    head.vx = game.speed * direction;
    head.vy = 0;
    game.isPause = false;
  }
}

function vertical(direction) {
  return () => {
    if (head.vy) {
      return;
    }
    game.isPause = true;
    head.vy = game.speed * direction;
    head.vx = 0;
    game.isPause = false;
  }
}
```
