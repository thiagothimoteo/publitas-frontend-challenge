export const scaleToFit = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  if (originalWidth < maxWidth && originalHeight < maxHeight) {
    return {
      width: originalWidth,
      height: originalHeight,
    }
  }

  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;

  const scale = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale)
  };
}

export const getImagePositionOnCanvas = (
  imageWidth: number,
  imageHeight: number,
  imageIndex: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  const offsetX = canvasWidth * imageIndex;

  const xAxis = (canvasWidth / 2 - imageWidth / 2) + offsetX;
  const yAxis = (canvasHeight / 2 - imageHeight /2);

  return { x: xAxis, y: yAxis }
}
