~~Tetris puzzle~~   
## [Tetris](https://5hez.github.io/games/pixi-Tetris/)
~~puzzle with pixi.js, just use the sprite draggle move and with Tetris.~~   
Just imitate the original rules of the Tetris.

### 1. Tetris delay
When paly the game, we will have a feeling that the Tetris drops with one grid. And we can speed up Tetris dropping with press the `down` button.    
	 
At first, I wanted to use the FSP to control the canvas refresh. But I found it's difficult to change some other status without the correctly FSP. So I used a `delay` variable to control the refresh rates with a timer.    
``` javascript
...
if (game.delayId) return;
	game.delayId = setTimeout(() => {
	game.delayId = null;
}, store.delay);
...
```
### 2. Tetris
In order to get a new Tetris randomly, I used an array to explain Tetris.
``` javascript
const tetris = [
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 0}, {x: 3, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 0, y: 0}]
];
```
You can see the array with 5 length, while the every Tetris has 4 square. And the last coordinate is used for explaining the origin when rotated.

### 3. Container with a Tetris
At first, I use a container to contain a Tetris. And I found the container's width and height can be able to change with the children of squares. I used the `width` and `height` to judge the `left move` and `right move`. When the tetris has normal angel, it useful. But the tetris rotates, the container's width and height not equal the squares real occupation.    
     
Now I just ignore the container's occupation, just use the square's occupation. I found it easy to rotate a tetris. Just add some functions to compute the squares with and height.
    
``` javascript

function getContainerWidth() {
  return getSpritesInCoordinate('x').length * game.spriteWidth;
}
function getContainerHeight() {
  return getSpritesInCoordinate('y').length * game.spriteWidth;
}
function leftSprites() {
  const leftX = _.sortBy(getSpritesInCoordinate('x'))[0];
  return _.sortBy(game.movingContainer.children, ['x']).filter(sprite => sprite.x === leftX);
}
function getSpritesInCoordinate(coo) {
  return [...new Set(game.movingContainer.children.map(sprite => sprite[coo]))]
}

```
    
### 3. Remove child from array
I made the same mistakes twice. Remove a child from array with forEach in previous, I made this mistake in the game [`2048`](https://5hez.github.io/games/2048/).    

### 4. fix bug
之前在左右移动的时候，如果方块两侧都有物体需要检测时候，会出现漏洞。
因为在检测的时候忘了考虑不需要检测的方块了。
    
```
      const movingBlock = movingHitSprites.find(s => Math.abs(s.y + cy - t.y) < 2);
      if (movingBlock) {
        if (direction === 'left'){
          return t.x <= movingBlock.x + cx;
        } else {
          return t.x >= movingBlock.x + cx;
        }
      }
```

### References
 - [Tetris rotate rule](https://vignette.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest?cb=20060626173148)   
 - [Tetris_Guideline](https://tetris.fandom.com/wiki/Tetris_Guideline)
