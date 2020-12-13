import { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import Link from "next/link";
import Image from "next/image";

import { processIngredient, returnIngredientJson } from "../lib/recipeHelper";
import RecipeQueryContext from "../lib/RecipeQueryContext";
import { getAllRecipes } from "../lib/api";
import { animated, useTransition, config } from "react-spring";
import orderBy from "lodash/orderBy";
import SEO from "../components/seo";

const RecipeListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  overflow: hidden;
  width: 100%;
  height: 232.92px;
  margin: 7.5px;
  border-radius: 4px;
  position: relative;
  transition: margin ease-in 100ms;
  flex-direction: column;
  border: 1px solid #000000;
  box-shadow: var(--form-shadow);

  .recipe__pic {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;

    /* img {
      z-index: -1;
      top: 0;
      left: 0;
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
    } */
    &:before {
      content: "";
      float: left;
      padding-top: 100%;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: ${({ hrbg }) =>
        hrbg
          ? `none`
          : "repeating-linear-gradient(45deg,#b2b2b2, #b2b2b2 10px,#ccc 10px,#ccc 20px)"};
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      transition: all ease-in 100ms;
      z-index: -2;
    }
  }
  .recipe__name {
    padding: 1px 7px;
    position: absolute;
    bottom: 0;
    height: 88px;
    width: 100%;
    display: block;
    opacity: 0;
    background: linear-gradient(
      180deg,
      rgba(196, 196, 196, 0) 0%,
      rgba(77, 77, 77, 0.567708) 56.77%,
      #646464 100%
    );
    color: var(--primary_text);
    z-index: 10;
    transition: opacity 200ms ease;
    .name {
      color: #ffffff;
      display: block;
      font-size: 18px;
      line-height: 18px;
    }
    .remark {
      margin-top: 3px;
      height: 3.3rem;
      font-size: 14px;
      line-height: 17px;
      color: #ffffff;

      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  &:hover {
    .recipe__name {
      opacity: 1;
    }
  }

  @media (min-width: 576px) {
    margin: 7.5px;
    .recipe__pic {
    }
    .recipe__name {
      .remark {
        height: 2.2rem;
        -webkit-line-clamp: 2;
      }
    }
  }

  @media (min-width: 768px) {
    margin: 7.5px;
  }

  @media (min-width: 992px) {
    margin: 10px;
  }

  @media (min-width: 1200px) {
    margin: 10px;
  }
`;

const RecipeListLink = styled.a`
  display: flex;
  width: 50%;
  color: #fffaf0;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: normal;
  transition: 300ms width ease-in-out;
  &:before {
    content: "";
    float: left;
    padding-top: 100%;
  }
  &:visited,
  &:active {
    color: #fffaf0;
  }

  @media (min-width: 576px) {
    width: 33.3%;
  }

  @media (min-width: 768px) {
    width: 25%;
  }

  @media (min-width: 992px) {
    width: 25%;
    font-size: 1.2rem;
  }

  @media (min-width: 1200px) {
    width: 25%;
    font-size: 1.2rem;
  }
`;

const RecipeList = styled(animated.ul)`
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin: 0 -7.5px;

  @media (min-width: 576px) {
    margin: 0 -7.5px;
  }

  @media (min-width: 768px) {
    margin: 0 -7.5px;
  }

  @media (min-width: 992px) {
    margin: 0 -10px;
  }

  @media (min-width: 1200px) {
    margin: 0 -10px;
  }
`;

const Home = ({ allRecipes }) => {
  const { type, query, search, setRecipeJson } = useContext(RecipeQueryContext);
  const [filteredAry, setFilteredAry] = useState(allRecipes);

  const transitions = useTransition(null, null, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    from: { opacity: 0 },
    config: config.stiff,
  });

  useEffect(() => {
    setRecipeJson(allRecipes);
  }, [allRecipes]);

  useEffect(() => {
    if (type === "all") setFilteredAry(allRecipes);

    // filter by type
    if (type !== "all")
      setFilteredAry(allRecipes.filter((recipe) => recipe.type === type));

    // filter by query string
    if (query && search.search)
      setFilteredAry(
        orderBy(search.search(query), ["date", "slug"], ["desc", "asc"])
      );
  }, [type, query, search]);

  return (
    <Layout>
      <SEO title="Recipe Blog" type="website" image={"/screencap.jpg"} />
      <RecipeList>
        {filteredAry.map((item, key) => (
          <Link
            href={`/recipe/[slug]`}
            as={`/recipe/${item.slug}`}
            passHref
            key={key}
          >
            <RecipeListLink key={item.slug}>
              <RecipeListItem hrbg={item.image}>
                <div className="recipe__pic">
                  {item.image && (
                    <Image
                      src={item.image}
                      layout="fill"
                      objectFit="cover"
                      className="recipe__pic"
                    />
                  )}
                </div>
                <span className="recipe__name">
                  <span className="name">{item.recipe_name}</span>
                  <span className="remark">{item.ingredients}</span>
                </span>
              </RecipeListItem>
            </RecipeListLink>
          </Link>
        ))}
      </RecipeList>
    </Layout>
  );
};

export async function getStaticProps() {
  const allRecipes = getAllRecipes([
    "recipe_name",
    "slug",
    "image",
    "date",
    // "serving",
    // "serving_size",
    "type",
    "description",
    "tags",
    "ingredients",
    // "content",
  ]);

  return {
    props: {
      allRecipes: allRecipes.map((post) => {
        return {
          ...post,
          ingredients: processIngredient(post.ingredients, post.serving)
            .map((item) =>
              item.ingredient.map((o) => o.ingredientName).join(" ‧ ")
            )
            .join(" ‧ "),
        };
      }),
    },
  };
}

export default Home;
