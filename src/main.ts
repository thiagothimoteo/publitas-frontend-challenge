import './style.css'
import Carousel from './carousel';
import { IMAGES_SOURCES } from './constants';

window.addEventListener('load', () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#carousel')!;

  const carousel = new Carousel(canvas, IMAGES_SOURCES);

  carousel.init();
});
