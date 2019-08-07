## 2048
2048 with pixi.js, just use the sprite move ~~&& simple hit test~~

- [x] render with sprite png   
Like the `learn pixi.js`, use the tool TexturePackerGUI. It can make `xx.json` and `xx.png` quickly. And with the code:   
``` javascript
  // make a ready
  pixi.textures = app.loader.resources['numberJson'].textures;
  // using
  let sprite2 = new PIXI.Sprite(pixi.textures[`n${value}.png`]);
  sprite2.x = strip(x);
  sprite2....
  // make a sprite container for all sprites
  pixi.spriteContainer.addChild(sprite2);
```

- [x] the 2/4 probability   
```javascript
  // copy from the learn pixi.js
  export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let randomNum = randomInt(0, 100) > pixi.probability ? 4 : 2;
```
- [x] use container contain all sprites   
Just like the first point, use the container mange all sprites will be so easy.   
- [x] `stag.removeChild()` vs `array.splice(array.findIndex(), 1)`     
At first, I use the array and stage manged all sprites at the same time. While, look at the following code:   
```javascript
  function hitMerge() {
    ...
    stage.removeChild(s1);
    pixi.sprites.splice(pixi.sprites.findIndex(s => s1.x === s.x && s1.y === s.y), 1);
  }
```
The `splice` may remove the wrong sprite with the same `x` and `y`, but `stage.removeChild` remove the right sprite.
- [x] add the fastest speed   
When the sprite is moving, all sprite has the same speed. But the first sprite that in the right sort array will be stop. And the next sprite has the higher speed will move forward the first sprite in one frame.   
So the sprite's fastest speed shouldn't more than `spriteWidth` + `margin`.    
- [x] use the sprite.scale   
I want to make an animation with new sprite. And just like the title, I think about the `sprite.scale` is the prop I want.    
At first, I think it should be 0 - 1 zoom relate sprite-self. Well, the `scale ` is relate to the picter that textured in sprite found in practice. So, I need to recored the scale value.   
```javascript
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
```
