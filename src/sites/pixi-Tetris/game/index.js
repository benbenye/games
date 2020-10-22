import * as PIXI from 'pixi.js'
import _ from 'lodash';
import one from '../assets/one.png';
import {keyboard, randomInt, strip, hitTestRectangle, movingContainerToStaticContainer, setupSprite} from '../pixi-util';
import {loadProgressHandler} from './control';


const tetris = [
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}],
  [{x: 0, y: 0}, {x: 3, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 0, y: 0}]
];

const createGame = (dpr, store) => {
  const width = document.getElementById(store.docId).clientWidth;
  const game = {
    dpr,
    width: width * dpr,
    spriteWidth: strip(width * dpr / 10),
    containerOffset: 3,
    isGameOver: false,
    isPause: false,
    guide: true,
    speed: strip(width * dpr / 10),
    movingContainer: new PIXI.Container(),
    staticBlockContainer: new PIXI.Container(),
    app: null,
  }

  game.start = () => {
    game.app = new App(game.width, game.dpr)
    game.app.stage.addChild(game.movingContainer);
    game.delay = store.delay;
    containerHandler();
    game.app.loader
      .add([one])
      .on('progress', loadProgressHandler)
      .load(() => {
        createIdTexture();
        gameStart();
        game.app.ticker.add(play);
      });
    eventHandler();
  }
  game.restart = () => {
    game.isRestarting = true;
    store.delay = game.delay;
    game.movingContainer.y = 0;
    game.movingContainer.vy = 0;
    game.movingContainer.removeChildren();
    game.app.stage.removeChildren();
    game.app.stage.addChild(game.movingContainer);
    game.isGameOver = false;
    gameStart();
    game.isRestarting = false;
  }
  game.pause = () => {
    game.isPause = !game.isPause;
  }
  const App = (width, dpr) => {

    const app = new PIXI.Application({
      width,
      height: width * 2,
      transparent: true
    });
    document.getElementById(store.docId).replaceWith(app.view);

    app.renderer.view.id = store.docId;
    app.renderer.view.style.verticalAlign = 'top';
    app.renderer.view.style.transform = `scale(${1/dpr})`;
    app.renderer.view.style.transformOrigin = `0 0`;
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.top = '0'
    app.renderer.view.style.left = '0'

    return app;

  }

  const gameStart = () => {
    createTetris(randomInt(0, tetris.length - 1));
  }

  const play = () => {
    if (game.isRestarting) return;
    if (game.delayId) return;
    game.delayId = setTimeout(() => {
      game.delayId = null;
      clearTimeout(game.delayId);
    }, store.delay);

    if (game.isPause) return;

    if (checkIsGameOver()) {
      game.isGameOver = true;
      return;
    }
    if (checkHit()) {
      updateTetris();
      return;
    }
    game.movingContainer.y += game.movingContainer.vy;
  }

  const updateTetris = () => {
    store.delay = game.delay;
    movingContainerToStaticContainer(game.movingContainer, game.app.stage);
    checkHasOneLine();
    createTetris(randomInt(0, tetris.length - 1))
  }

  const checkIsGameOver = () => {
    return !!game.app.stage.children.filter(sprite => sprite.isSprite)
    .filter(sprite =>
      sprite.x >= game.spriteWidth * game.containerOffset && sprite.x * game.spriteWidth * (game.containerOffset + 5) && sprite.y <= 2
    ).length
  }

  const checkHit = () => {
    game.movingContainer.children.forEach(e => e.tint = 0xFFFFFF);
    let sprites = game.app.stage.children.filter(e => e.isSprite);
    if (sprites.length) {
      let xs = [...new Set(game.movingContainer.children.map(t => t.x + game.movingContainer.x))];
      let movingSprites = xs.map(x =>
        _.last(_.sortBy(game.movingContainer.children.filter(sprite => sprite.x + game.movingContainer.x === x), ['y']))
      );
      let allInX = sprites.filter(t =>
        xs.some(x => Math.abs(x - t.x) < 2)
      );

      if (allInX.length) {
        let hitSprites = movingSprites.map(movingSprite =>
          _.first(_.sortBy(allInX.filter(sprite =>
            Math.abs(sprite.x - movingSprite.x - game.movingContainer.x) < 2 &&
            sprite.y - movingSprite.y - game.movingContainer.y >= -1), ['y']))
        );
        if (_.compact(hitSprites).length) {
          return hitMovingBottom(hitSprites, movingSprites);
        }
        return hitWithBottom();
      }

      game.app.stage.children.filter(sprite => sprite.isSprite).forEach(sprite => sprite.tint = 0xFFFFFF);

      return hitWithBottom();
    }
    return hitWithBottom();
  }
  const containerHandler = () => {
    game.left = () => {
      if (game.isDowning || game.isPause) return;
      if (game.movingContainer.x + leftSprites()[0].x - game.spriteWidth < -1) return;
      game.isPause = true;
      if (checkHitHorizontal(game.movingContainer, game.app.stage, 'left')) {
        game.isPause = false;
        return;
      }
      game.movingContainer.x = strip(game.movingContainer.x - game.spriteWidth);
      game.isPause = false;
    }
    game.right = () => {
      if (game.isDowning || game.isPause) return;
      if (game.movingContainer.x + leftSprites()[0].x + getContainerWidth() > game.width - 1) return;
      game.isPause = true;
      if (checkHitHorizontal(game.movingContainer, game.app.stage, 'right')) {
        game.isPause = false;
        return;
      }

      game.movingContainer.x += game.spriteWidth;
      game.isPause = false;
    }
    game.down = () => {
      if (game.isDowning || game.isPause) return;
      game.isDowning = true;
      store.delay = 5;
      clearTimeout(game.delayId);
      game.delayId = null;
      if (checkHit()) {
        updateTetris();
        return;
      }
    }
    game.up = () => {
      if (game.isDowning) return;
      rotate(game.movingContainer.idName);
    }
  }

  const createIdTexture = () => {
    game.texture = PIXI.Texture.from(one);
  }


  const createTetris = (index, offsetX = 0, offsetY = 0) => {
    let movingTetris = typeof index === 'number' ? tetris[index] : game.movingContainer.tetris;
    movingTetris.slice(0, 4).map(t => {
      game.movingContainer.addChild(setupSprite({
        x: (t.x - offsetX) * game.spriteWidth,
        y: (t.y - offsetY) * game.spriteWidth,
        v: {
          vx: 0,
          vy: 0
        },
        texture: game.texture,
        spriteWidth: game.spriteWidth
      }));
    });
    game.movingContainer.tetris = movingTetris;
    game.movingContainer.vy = game.speed;
    if (typeof index === 'number') {
      game.movingContainer.x = strip(game.spriteWidth * game.containerOffset);
      if (_.last(movingTetris).x === 1 && _.last(movingTetris).y === 1) {
        game.movingContainer.y = -1 * game.spriteWidth;
      } else {
        game.movingContainer.y = -2 * game.spriteWidth;
      }

    }
    game.isDowning = false;
    game.movingContainer.idName = index;
  }

  const checkHasOneLine = () => {
    let sprites = _.sortBy(game.app.stage.children.filter(child => child.isSprite), ['y']).reverse();
    if (!sprites.length) return;
    let sortByY = [[sprites[0]]];
    sprites.slice(1).forEach(sprite => {
      let index = sortByY.findIndex(sprites =>{
        return Math.abs(sprites[0].y - sprite.y) < 2
      })
      if (index === -1) {
        let l = [sprite];
        sortByY.push(l);
        return;
      };
      sortByY[index].push(sprite);
    });
    sortByY.forEach((sortSprites, i) => {
      if (sortSprites.length === 10) {
        let i = 0;
        game.isPause = true;
        let ss = setInterval(() => {
          sortSprites.forEach(sprite => {
            if (i % 2) {
              sprite.alpha = 0.5
              return
            }
              sprite.alpha = 1
          });
          if (i > 3) {
            clearInterval(ss)
            sortSprites.forEach(sprite => {
              game.app.stage.removeChild(sprite);
            });
            sprites.filter(sprite => sprite.y < sortSprites[0].y).forEach(s => {
              s.y += game.spriteWidth;
            })
            // sortByY.slice(i).forEach(s => {
            //   s.forEach(sprite => {
            //     sprite.y += game.spriteWidth;
            //   })
            // })
            game.isPause = false;
          }
          ++i
        }, 150);
      }
    })
  }

  const checkHitHorizontal = (movingContainer, staticBlockContainer, direction) => {
    movingContainer.children.forEach(e => e.tint = 0xFFFFFF);
    const staticSprites = staticBlockContainer.children.filter(e => e.isSprite);
    if (!staticSprites.length) return null;
    const movingSprites = movingContainer.children;
    const cy = movingContainer.y;
    const cx = movingContainer.x;
    const allYCoos = [...new Set(movingSprites.map(t => t.y + cy))];
    const movingHitSprites = allYCoos.map(y => {
      if (direction === 'left') {
        return _.first(_.sortBy(movingSprites.filter(sprite => sprite.y + cy === y), ['x']))
      } else {
        return _.last(_.sortBy(movingSprites.filter(sprite => sprite.y + cy === y), ['x']))
      }
    });
    const staticInYSprites = staticSprites.filter(t => {
      const movingBlock = movingHitSprites.find(s => Math.abs(s.y + cy - t.y) < 2);
      if (movingBlock) {
        if (direction === 'left'){
          return t.x <= movingBlock.x + cx;
        } else {
          return t.x >= movingBlock.x + cx;
        }
      }
      return false;
    });

    if (!staticInYSprites.length) return null;

    const hitSprites = movingHitSprites.map(mhs => {
      if (direction === 'left') {
        return _.last(_.sortBy(staticInYSprites.filter(sprite =>
        Math.abs(sprite.y - mhs.y - cy) < 2), ['x']))
      } else {
        return _.first(_.sortBy(staticInYSprites.filter(sprite =>
        Math.abs(sprite.y - mhs.y - cy) < 2), ['x']))
      }
    });
    return hitMovingHorizontalStatus(hitSprites, movingHitSprites, direction);
  };

  const hitMovingBottom = (hit, moving) => {
    game.app.stage.children.filter(sprite => sprite.isSprite).forEach(sprite => sprite.tint = 0xFFFFFF);
    if (game.movingContainer) {
      game.movingContainer.children.forEach(sprite => sprite.tint = 0xFFFFFF);
    }
    return moving.some(movingSprite => {
      if (!movingSprite) return false;
      let hitSprite = hit.find(sprite => sprite && Math.abs(movingSprite.x + game.movingContainer.x - sprite.x) < 2);
      if (!hitSprite) return false;
      game.guide && (hitSprite.tint = 0xFF0000);
      game.guide && (movingSprite.tint = 0x01FF00);
      return hitTestRectangle(hitSprite, {
        x: movingSprite.x + game.movingContainer.x,
        y: movingSprite.y + game.movingContainer.y,
        width: movingSprite.width,
        height: movingSprite.height
      }, 'down')
    }) ? 'hit' : null;
  }

  const hitMovingHorizontalStatus = (hit, moving, direction) => {
    return moving.some(movingSprite => {
      if (!movingSprite) return false;
      let hitSprite = hit.find(sprite => sprite && Math.abs(movingSprite.y + game.movingContainer.y - sprite.y) < 2);
      if (!hitSprite) return false;
      if (direction === 'left') {
        game.guide && (hitSprite.tint = 0xC2F546);
        game.guide && (movingSprite.tint = 0xD607C6);
      } else {
        game.guide && (hitSprite.tint = 0x003D82);
        game.guide && (movingSprite.tint = 0x01FF00);
      }
      return hitTestRectangle(hitSprite, {
        x: movingSprite.x + game.movingContainer.x,
        y: movingSprite.y + game.movingContainer.y,
        width: movingSprite.width,
        height: movingSprite.height
      }, direction)
    }) ? `hit-${direction}` : null;
  }

  const hitWithBottom = () => {
    return isContain(game.movingContainer, {
      height: game.app.renderer.height
    });
  }

  const isContain = (sprite, container) => {
    let collision = null;
    const height = getContainerHeight();
    const topSpriteY = getSpritesInCoordinate('y').sort((a, b) => {
      if (a - b < 0) return -1;
      return 1;
    })[0];
    if (strip(game.movingContainer.y + topSpriteY + height) >= strip(container.height)) {
      sprite.vy = 0;
      collision = "bottom";
    }

    return collision;
  }

  const eventHandler = () => {
    keyboard(37).release = game.left;
    keyboard(38).release = game.up;
    keyboard(39).release = game.right;
    keyboard(40).release = game.down;
    keyboard(32).release = game.pause;
  }

  const getContainerWidth = () => {
    return getSpritesInCoordinate('x').length * game.spriteWidth;
  }
  const getContainerHeight = () => {
    return getSpritesInCoordinate('y').length * game.spriteWidth;
  }
  const leftSprites = () => {
    const leftX = _.sortBy(getSpritesInCoordinate('x'))[0];
    return _.sortBy(game.movingContainer.children, ['x']).filter(sprite => sprite.x === leftX);
  }

  const getSpritesInCoordinate = (coo) => {
    return [...new Set(game.movingContainer.children.map(sprite => sprite[coo]))]
  }

  const rotate = () => {
    // check can be rotate
    // 狭窄的地方，旋转之后有重叠，不允许旋转
    // T-pin

    let {tetris} = game.movingContainer;
    const original = tetris.slice(0, 4);
    const origin = tetris[4];
    let offsetIX = 0;
    if (origin.x === 0 && origin.y === 0) return;
    if (origin.x === 1 && origin.y === 0) {
      offsetIX = 1;
    }
    const newTetris = original.map(o => {
      return {
        x: origin.x + origin.y - o.y + offsetIX,
        y: o.x + origin.y - origin.x
      };
    });
    correctCoordinate(newTetris);
    newTetris.push(origin);
    game.movingContainer.tetris = newTetris;
    game.movingContainer.removeChildren();
    console.log(game.movingContainer.width, game.movingContainer.height)
    createTetris('rotate');
  }

  const correctCoordinate = (cos) => {
    // 1 for overflow x, 0 for overflow bottom
    let dirRight = 0;
    let dirLeft = 0;
    let dirY = 0;
    const conX = game.movingContainer.x;
    const conY = game.movingContainer.y;
    cos.forEach(co => {
      let left = co.x * game.spriteWidth + conX;
      if ( left < 0 ) {
        dirLeft = 1;
      }
      if (strip(left + game.spriteWidth) > game.app.renderer.width) {
        dirRight = 1;
      }
      if (strip(co.y * game.spriteWidth + conY + game.spriteWidth) > game.app.renderer.height) {
        dirY = 1;
      }
    });
    if (!dirLeft && !dirRight && !dirY) return;
    if (dirLeft) {
      game.movingContainer.x -= _.first(_.sortBy(cos, ['x'])).x * game.spriteWidth + conX;
    }
    if (dirRight) {
      game.movingContainer.x -= _.last(_.sortBy(cos, ['x'])).x * game.spriteWidth + game.spriteWidth + conX - game.app.renderer.width;
    }
    if(dirY) {
      game.movingContainer.y -= _.last(_.sortBy(cos, ['y'])).y * game.spriteWidth + game.spriteWidth + conY - game.app.renderer.height
    }
  }

  return game;
}

export default createGame;
