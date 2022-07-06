import Cursor from '../cursor';
import {Grid} from './Grid';
import {preloadImages} from '../utils';

console.clear();

// Preload  images
preloadImages('.grid__item-img, .bigimg').then(() => {
  // Remove loader (loading class)

  // 画像多ければ多いほど、インジケータを用意して対応する 簡易ダミー
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 3000);

  // Initialize grid
  const grid = new Grid(document.querySelector('.grid'));
});

const cursor = new Cursor(document.querySelector('.cursor'));
