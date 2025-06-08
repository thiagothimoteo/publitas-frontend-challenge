import { getImagePositionOnCanvas, scaleToFit, updateTranslateX } from './carousel.helpers';

export default class Carousel {
  readonly canvas: HTMLCanvasElement | null;
  readonly context: CanvasRenderingContext2D | null | undefined;
  readonly imagesSources: string[];
  images: HTMLImageElement[];
  #startX: number;
  #state: 'idle' | 'dragging';
  #currentTranslateX: number;
  #previousTranslateX: number;

  constructor (elem: HTMLCanvasElement | null, imagesSources: string[]) {
    this.canvas = elem;
    this.context = this.canvas?.getContext('2d');

    this.#state = 'idle';
    this.imagesSources = imagesSources;
    this.images = [];

    this.#startX = 0;
    this.#currentTranslateX = 0;
    this.#previousTranslateX = 0;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  loadImage(imgSrc: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.src = imgSrc;

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${imgSrc}`));
    });
  }

  async setImages() {
    const loadPromises = this.imagesSources.map(imgSrc => this.loadImage(imgSrc))
    const images = await Promise.all(loadPromises);

    this.images = images;
  }

  drawImages() {
    const canvas = this.canvas;
    const ctx = this.context;

    if (!ctx || !canvas) return;

    this.images.forEach((image, index) => {
      const { width, height } = scaleToFit(image.width, image.height, canvas.width, canvas.height);
      const { x, y } = getImagePositionOnCanvas(width, height, index, canvas.width,  canvas.height);

      ctx?.drawImage(image, x, y, width, height);
    });
  }

  draw(translateX: number = 0) {
    const canvas = this.canvas;
    const ctx = this.context;

    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(translateX, 0);

    this.drawImages();

    ctx.restore();
  }

  handleMouseDown = (event: MouseEvent | TouchEvent) => {
    this.#state = 'dragging';

    const canvas = this.canvas!;

    canvas.style.cursor = 'grabbing';

    const clientX = event.type === 'mousedown'
      ? (event as MouseEvent).clientX
      : (event as TouchEvent).touches[0].clientX;

    this.#startX = clientX - canvas.getBoundingClientRect().left;
  }

  handleMouseUp() {
    this.#state = 'idle';
    this.canvas!.style.cursor =  'grab';

    this.#previousTranslateX = this.#currentTranslateX;
  }

  get maxTranslateX() {
    return -1 * ((this.images.length * this.canvas!.width) - this.canvas!.width);
  }

  handleMouseMove(event: MouseEvent | TouchEvent) {
    if (this.#state !== 'dragging') return;

    const clientX = event.type === 'mousemove'
      ? (event as MouseEvent).clientX
      : (event as TouchEvent).touches[0].clientX;

    this.#currentTranslateX = updateTranslateX(
      clientX,
      this.#startX,
      this.canvas!.getBoundingClientRect().left,
      this.#previousTranslateX,
      this.maxTranslateX,
    );

    requestAnimationFrame(() => this.draw(this.#currentTranslateX));
  }

  async init() {
    await this.setImages();

    if (!this.canvas) throw new Error('Failed to find canvas element!');

    const canvas = this.canvas;

    canvas.style.cursor =  'grab';

    // MOUSE EVENTS FOR DESKTOP
    canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    // TOUCH EVENTS FOR MOBILE
    canvas.addEventListener('touchstart', this.handleMouseDown);
    window.addEventListener('touchmove', this.handleMouseMove);
    window.addEventListener('touchend', this.handleMouseUp);

    this.draw();
  }
}
