// import fs from "fs";
// import { join } from "path";
// import matter from "gray-matter";
import produce from "immer";

export const returnIngredientJson = (string) => {
  let amount = null;
  let scale = null;

  const ingredientNameRgx = new RegExp(/(?<=\.\.\.\.\.\s).*./g);

  const ingredientAmtRgx = new RegExp(/([\d|\w|\-]\S*)(?=\s*\.\.\.\.\.\s)/g);

  // get the ingredient name part
  const ingredientName = string.match(ingredientNameRgx)[0];

  // get the ingredient amount and scale part
  let amtScaleString = "";
  if (string.match(ingredientAmtRgx)) {
    amtScaleString = string.match(ingredientAmtRgx)[0];
    amount = amtScaleString.match(new RegExp(/[+-]?([0-9]*[.])?[0-9]+/g));
    scale = amtScaleString.replace(
      new RegExp(/[+-]?([0-9]*[.])?[0-9]*?[\-]|[+-]?([0-9]*[.])?[0-9]*/),
      ""
    );
    if (amount) {
      amount = parseFloat(amount, 10);
    }
  }
  return { amount, scale, ingredientName };
};

export const processIngredient = (ingredientObj, originalServing) =>
  ingredientObj.map((ingGrp) =>
    produce(ingGrp, (draft) => {
      draft.ingredient = draft.ingredient.map((ing) => {
        let ingredient = returnIngredientJson(ing);
        // calculate the average amount of the ingredient
        ingredient.amount = ingredient.amount / originalServing;
        return ingredient;
      });
      return draft;
    })
  );
