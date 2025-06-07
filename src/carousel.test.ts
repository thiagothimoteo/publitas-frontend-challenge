import { describe, it, expect } from 'vitest';
import { scaleToFit, getImagePositionOnCanvas } from './carousel.helpers';

describe('#scaleToFit', () => {
  describe('given the original dimensions are smaller than the max dimensions', () => {
    describe('when the original width and height are both under limits', () => {
      it('then it should return the original dimensions without scaling', () => {
        const result = scaleToFit(300, 200, 640, 400);
        expect(result).toEqual({ width: 300, height: 200 });
      });
    });
  });

  describe('given the original width exceeds the max width', () => {
    describe('when the height fits within the limit', () => {
      it('then it should scale down proportionally by width ratio', () => {
        const result = scaleToFit(800, 200, 640, 400);
        // scale = 640 / 800 = 0.8 -> new size = 640 x 160
        expect(result).toEqual({ width: 640, height: 160 });
      });
    });
  });

  describe('given the original height exceeds the max height', () => {
    describe('when the width fits within the limit', () => {
      it('then it should scale down proportionally by height ratio', () => {
        const result = scaleToFit(300, 500, 640, 400);
        // scale = 400 / 500 = 0.8 -> new size = 240 x 400
        expect(result).toEqual({ width: 240, height: 400 });
      });
    });
  });

  describe('given both original width and height exceed the limits', () => {
    describe('when the height ratio is smaller than the width ratio', () => {
      it('then it should scale down by the smaller ratio to maintain aspect ratio', () => {
        const result = scaleToFit(1600, 1200, 640, 400);
        // widthRatio = 640/1600 = 0.4
        // heightRatio = 400/1200 = 0.333...
        // use 0.333... -> new size = 533 x 400
        expect(result).toEqual({ width: 533, height: 400 });
      });
    });
  });

  describe('given the original size matches the max size exactly', () => {
    describe('when width and height are equal to the max values', () => {
      it('then it should return the same dimensions', () => {
        const result = scaleToFit(640, 400, 640, 400);
        expect(result).toEqual({ width: 640, height: 400 });
      });
    });
  });
});

describe('#getImagePositionOnCanvas', () => {
  describe('given an image smaller than the canvas', () => {
    describe('when the image index is 0', () => {
      it('then it should center the image on the canvas', () => {
        const result = getImagePositionOnCanvas(200, 100, 0, 640, 400);

        expect(result).toEqual({
          x: 220, // (640 / 2 - 200 / 2)
          y: 150  // (400 / 2 - 100 / 2)
        });
      });
    });

    describe('when the image index is higher than 0', () => {
      describe('and the image index is 1', () => {
        it('then it should center the image and offset it by one canvas width', () => {
          const result = getImagePositionOnCanvas(200, 100, 1, 640, 400);

          expect(result).toEqual({
            x: 220 + 640,
            y: 150
          });
        });
      });

      describe('and the image index is greater than 1', () => {
        it('then it should offset the image by index * canvas width and center it vertically', () => {
          const result = getImagePositionOnCanvas(100, 50, 3, 800, 600);

          expect(result).toEqual({
            x: (800 / 2 - 100 / 2) + 3 * 800,
            y: (600 / 2 - 50 / 2)
          });
        });
      })
    });
  });
});
