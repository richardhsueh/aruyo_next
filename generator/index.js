const dateFns = require("date-fns");
const path = require("path");
const { exec } = require("child_process");
module.exports = function (plop) {
  // controller generator
  plop.setGenerator("recipe", {
    description: "application controller logic",
    prompts: [
      {
        type: "input",
        name: "recipeName",
        message: "Recipe Name:",
      },
      {
        type: "input",
        name: "slug",
        message: "Slug:",
      },
      {
        type: "input",
        name: "serving",
        message: "Serving:",
        default: 1,
      },
      {
        type: "input",
        name: "servingSize",
        message: "Serving Size:",
      },
      {
        type: "list",
        name: "type",
        message: "Recipe Type:",
        default: "sweet",
        choices: ["sweet", "savoury"],
      },
      {
        type: "list",
        name: "status",
        message: "Recipe Status:",
        default: "wip",
        choices: ["wip", "draft", "final"],
      },
    ],
    actions: [
      {
        type: "add",
        path: "../_posts/{{slug}}.md",
        data: {
          date: dateFns.format(new Date(), "yyyy-MM-dd"),
        },
        templateFile: "recipe-template.md.hbs",
      },
      {
        type: "prettify",
      },
    ],
  });
  plop.setActionType("prettify", (answers, config) => {
    const folderPath = `${path.join(
      __dirname,
      "/../_posts/",
      `/${answers.slug}.md`
    )}`;
    // const folderPath = `./src/pages/${answers.slug}/index.md`;
    exec(`code "${folderPath}"`);
    // return folderPath;
  });
};
