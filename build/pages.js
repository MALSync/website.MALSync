const { Canvas, Image } = require('canvas');
const fs = require('fs');
const path = require('path');
const pages = require('../pages/pages32.json');

start();
async function start() {
  const collage1 = await createCollage(pages, 25);
  const out1 = fs.createWriteStream('screenshots/pages.png')
  collage1.pipe(out1)

  const collage2 = await createCollage(pages, 10);
  const out2 = fs.createWriteStream('screenshots/pages-mobile.png')
  collage2.pipe(out2)
}

async function createCollage(pages, imagesPerRow) {
  const options = {
    width: imagesPerRow, // number of images per row
    height: Math.ceil(pages.length / imagesPerRow), // number of images per column
    imageWidth: 32,
    imageHeight: 32,
    backgroundColor: 'transparent',
    spacingX: 10,
    spacingY: 10,
  };

  const headerHeight = 0;
  const canvasWidth = options.width * options.imageWidth + (options.width - 1) * options.spacingX;
  const canvasHeight = headerHeight + options.height * (options.imageHeight + options.spacingY);
  const canvas = new Canvas(canvasWidth, canvasHeight);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const downloadImages = await Promise.all(
    pages.map(async page => {
      const imageData = await downloadPhoto(page.name + '_32.png');
      return {
        image: imageData,
        ...page,
      };
    }),
  );

  downloadImages.forEach((element, i) => {
    const img = new Image();
    img.src = element.image;

    const imgX = (i % options.width) * (options.imageWidth + options.spacingX);
    const imgY = Math.floor(i / options.width) * (options.imageHeight + options.spacingY);

    const hRatio = options.imageWidth / img.width;
    const vRatio = options.imageHeight / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShiftX = (options.imageWidth - img.width * ratio) / 2;
    const centerShiftY = options.imageHeight - img.height * ratio;

    ctx.drawImage(img, imgX + centerShiftX, imgY + headerHeight + centerShiftY, img.width * ratio, img.height * ratio);
  });

  return canvas.createPNGStream({
    compressionLevel: 0
  });
}

function downloadPhoto(call) {
  return fs.readFileSync(path.join(__dirname, `../pages/${call}`));
}