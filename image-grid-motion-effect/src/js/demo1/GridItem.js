import {gsap} from 'gsap';
import {map, lerp, getMousePos, calcWinsize, getRandomNumber} from '../utils';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => (winsize = calcWinsize()));

// Track the mouse position
let mousepos = {x: winsize.width / 2, y: winsize.height / 2};
window.addEventListener('mousemove', (ev) => (mousepos = getMousePos(ev)));

class GridItem {
  constructor(el) {
    this.DOM = {el: el};
    this.move();

    this.handleMousemove = (e) => {
      //当たり判定ロジックをここに書く
      // 当たったらシュリンク
      // console.log('handleMousemove', e);
    };

    this.handleClick = (e) => {
      // クリックしたらモーダル表示ないしは別ページへ遷移
      //当たり判定ロジックをここに書く
      // console.log('handleClick', e);
    };

    document.addEventListener('click', this.handleClick);
    document.addEventListener('mousemove', this.handleMousemove);
  }

  subscribe() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('mousemove', this.handleMousemove);
  }

  unsubscribe() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('mousemove', this.handleMousemove);
  }

  // Move the items when moving the cursor
  move() {
    // amounts to move in each axis
    let translationVals = {tx: 0, ty: 0};
    // get random start and end movement boundaries
    const xstart = getRandomNumber(15, 30);
    const ystart = getRandomNumber(15, 30);

    // infinite loop
    const render = () => {
      // Calculate the amount to move.
      // Using linear interpolation to smooth things out.
      // Translation values will be in the range of [-start, start] for a cursor movement from 0 to the window's width/height
      translationVals.tx = lerp(
        translationVals.tx,
        map(mousepos.x, 0, winsize.width, -xstart, xstart),
        0.07
      );
      translationVals.ty = lerp(
        translationVals.ty,
        map(mousepos.y, 0, winsize.height, -ystart, ystart),
        0.07
      );

      gsap.set(this.DOM.el, {x: translationVals.tx, y: translationVals.ty});
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}

export {GridItem};
