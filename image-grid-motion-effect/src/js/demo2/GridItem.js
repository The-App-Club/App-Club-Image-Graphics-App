import {gsap} from 'gsap';
import {map, lerp, getMousePos, calcWinsize, getRandomNumber} from '../utils';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => (winsize = calcWinsize()));

let mousepos = {x: winsize.width / 2, y: winsize.height / 2};
window.addEventListener('mousemove', (ev) => (mousepos = getMousePos(ev)));

class GridItem {
  constructor(el) {
    this.DOM = {el: el};
    this.move();
    this.handleMousemove = (e) => {
      //当たり判定ロジックをここに書く
      // console.log('handleMousemove', e);
    };

    this.handleClick = (e) => {
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
  move() {
    let translationVals = {tx: 0, ty: 0, r: 0};
    const xstart = getRandomNumber(15, 60);
    const ystart = getRandomNumber(30, 90);
    const randR = getRandomNumber(-15, 15);

    const render = () => {
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
      translationVals.r = lerp(
        translationVals.r,
        map(mousepos.x, 0, winsize.width, -randR, randR),
        0.07
      );

      gsap.set(this.DOM.el, {
        x: translationVals.tx,
        y: translationVals.ty,
        rotation: translationVals.r,
      });
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}

export {GridItem};
