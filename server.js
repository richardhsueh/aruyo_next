const fs = require("fs");
const canvas = require("canvas");
const {
  capitalizeFirstLetter,
  roundRect,
  canvasTxt,
  getAllRecipes,
} = require("./lib/previewImageHelper.js");

const { createCanvas, registerFont, loadImage } = canvas;

const allRecipes = getAllRecipes([
  "recipe_name",
  "slug",
  "image",
  "date",
  "type",
  "description",
  "tags",
  "ingredients",
]);

const width = 540;
const height = 281;

registerFont("./public/fonts/NotoSansTC-Regular.otf", {
  family: "NotoSansTC",
  weight: "regular",
});
registerFont("./public/fonts/NotoSansTC-Bold.otf", {
  family: "NotoSansTC",
  weight: "bold",
});

allRecipes.forEach((post) => {
  const cnvs = createCanvas(width, height);
  const context = cnvs.getContext("2d");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  if (post.image && post.image[0]) {
    const txt = post.recipe_name;
    context.font = "NotoSansTC";
    context.fillStyle = "#000";
    canvasTxt.fontSize = 30;
    canvasTxt.lineHeight = 35;
    canvasTxt.fontWeight = "bold";
    canvasTxt.align = "left";
    canvasTxt.vAlign = "top";
    canvasTxt.drawText(context, txt, 260, 40, 230, 90);

    canvasTxt.fontSize = 18;
    canvasTxt.fontWeight = "regular";
    canvasTxt.drawText(context, post.date, 260, 220, 230, 200);

    canvasTxt.fontSize = 18;
    canvasTxt.fontWeight = "bold";
    canvasTxt.drawText(
      context,
      `${capitalizeFirstLetter(post.type)} recipe`,
      260,
      200,
      230,
      200
    );

    context.fillStyle = "transparent";
    roundRect(context, 20, 20, 500, 240, 6, "#000", true);

    roundRect(context, 40, 40, 200, 200, 3, "#fff", true);
    context.clip();

    loadImage(`./public/${post.image[0]}`).then((image) => {
      context.drawImage(image, 40, 40, 200, 200);
      const buffer = cnvs.toBuffer("image/png");

      fs.writeFileSync(
        `./public/assets/recipe/preview-${post.slug}.png`,
        buffer
      );
    });
  } else {
    const txt = post.recipe_name;
    context.font = "NotoSansTC";
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

    const buffer = cnvs.toBuffer("image/png");

    fs.writeFileSync(`./public/assets/recipe/preview-${post.slug}.png`, buffer);
  }
});
