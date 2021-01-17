import canvasTxt from "canvas-txt";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import { roundRect } from "./canvasHelper";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const previewImageGenerator = async (post) => {
  const width = 540;
  const height = 281;

  registerFont("./public/fonts/Inter-Regular.ttf", {
    family: "Inter",
    weight: "regular",
  });
  registerFont("./public/fonts/Inter-Bold.ttf", {
    family: "Inter",
    weight: "bold",
  });

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  if (post.image && post.image[0]) {
    const txt = post.recipe_name;
    context.font = "Inter";
    context.fillStyle = "#000";
    canvasTxt.fontSize = 30;
    canvasTxt.lineHeight = 35;
    canvasTxt.fontWeight = "bold";
    canvasTxt.align = "left";
    canvasTxt.vAlign = "top";
    canvasTxt.drawText(context, txt, 280, 40, 230, 90);

    canvasTxt.fontSize = 18;
    canvasTxt.fontWeight = "regular";
    canvasTxt.drawText(context, post.date, 280, 220, 230, 200);

    canvasTxt.fontSize = 18;
    canvasTxt.fontWeight = "bold";
    canvasTxt.drawText(
      context,
      `${capitalizeFirstLetter(post.type)} recipe`,
      280,
      200,
      230,
      200
    );

    context.fillStyle = "transparent";
    roundRect(context, 20, 20, 500, 240, 6, "#000", true);

    roundRect(context, 40, 40, 220, 200, 3, "#fff", true);
    context.clip();

    loadImage(`./public/${post.image[0]}`).then((image) => {
      context.drawImage(image, 40, 40, 220, 200);
      const buffer = canvas.toBuffer("image/png");

      fs.writeFileSync(
        `./public/assets/recipe/preview-${post.slug}.png`,
        buffer
      );

      //   sharp(`./public/assets/recipe/preview-${post.slug}.png`)
      //     .toFormat("webp")
      //     .toFile(`./public/assets/recipe/preview-${post.slug}.webp`);
    });
  } else {
    const txt = post.recipe_name;
    context.font = "Inter";
    context.fillStyle = "#000";
    canvasTxt.fontSize = 30;
    canvasTxt.lineHeight = 35;
    canvasTxt.fontWeight = "bold";
    canvasTxt.align = "left";
    canvasTxt.vAlign = "top";
    canvasTxt.drawText(context, txt, 40, 40, 250, 90);

    canvasTxt.fontSize = 18;
    canvasTxt.fontWeight = "regular";
    canvasTxt.drawText(context, post.date, 40, 220, 230, 200);

    canvasTxt.fontSize = 18;
    canvasTxt.fontWeight = "bold";
    canvasTxt.drawText(
      context,
      `${capitalizeFirstLetter(post.type)} recipe`,
      40,
      200,
      230,
      200
    );

    context.fillStyle = "transparent";
    roundRect(context, 20, 20, 500, 240, 6, "#000", true);

    const buffer = canvas.toBuffer("image/png");

    fs.writeFileSync(`./public/assets/recipe/preview-${post.slug}.png`, buffer);
  }
};

export default previewImageGenerator;
