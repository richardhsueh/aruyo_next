import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import orderBy from 'lodash/orderBy'

const recipesDirectory = join(process.cwd(), "_posts");

export function getRecipeSlugs() {
  return fs.readdirSync(recipesDirectory);
}

export function getRecipeBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(recipesDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === "slug") {
      items[field] = realSlug;
      // items.pagePath = `/recipe/${realSlug}`;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (field === "serving") {
        items[field] = data[field] || 1; 
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllRecipes(fields = []) {
  const slugs = getRecipeSlugs();
  return orderBy(slugs.map(slug => getRecipeBySlug(slug, fields)), ["date", "slug"], ["desc", "asc"]);
}
