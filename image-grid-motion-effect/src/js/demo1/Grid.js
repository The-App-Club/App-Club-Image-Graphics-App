import {gsap} from 'gsap';
import {map, lerp, getMousePos, calcWinsize, getRandomNumber} from '../utils';
import {GridItem} from './GridItem';

class Grid {
  constructor(el) {
    this.DOM = {el: el};
    this.gridItems = [];
    this.items = [...this.DOM.el.querySelectorAll('.grid__item')];
    this.items.forEach((item) => this.gridItems.push(new GridItem(item)));

    this.showItems();

    document.querySelector('.unsubscribe').addEventListener('click', () => {
      this.gridItems.forEach((gridItem) => {
        gridItem.unsubscribe();
      });
    });
    document.querySelector('.subscribe').addEventListener('click', () => {
      this.gridItems.forEach((gridItem) => {
        gridItem.subscribe();
      });
    });
  }

  // Initial animation to scale up and fade in the items
  showItems() {
    gsap
      .timeline()
      .set(this.items, {scale: 0.7, opacity: 0}, 0)
      .to(
        this.items,
        {
          duration: 2,
          ease: 'Expo.easeOut',
          scale: 1,
          stagger: {amount: 0.6, grid: 'auto', from: 'center'},
        },
        0
      )
      .to(
        this.items,
        {
          duration: 3,
          ease: 'Power1.easeOut',
          opacity: 0.4,
          stagger: {amount: 0.6, grid: 'auto', from: 'center'},
        },
        0
      );
  }
}

export {Grid};
