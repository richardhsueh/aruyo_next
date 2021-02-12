import { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { animated, useTransition, config } from "react-spring";
import orderBy from "lodash/orderBy";
import { Flipper, Flipped, spring } from "react-flip-toolkit";

import SEO from "../components/seo";
import { processIngredient, returnIngredientJson } from "../lib/recipeHelper";
import RecipeQueryContext from "../lib/RecipeQueryContext";
import { getAllRecipes } from "../lib/api";

const RecipeListItem = styled.li`
  display: flex;
  color: var(--background);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: normal;
  transition: 300ms width ease-in-out;
  position: relative;
  &:before {
    content: "";
    float: left;
    padding-top: 100%;
  }
  &:visited,
  &:active {
    color: var(--background);
  }

  @media (min-width: 992px) {
    font-size: 1.2rem;
  }

  @media (min-width: 1200px) {
    font-size: 1.2rem;
  }
`;

const RecipeListLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  overflow: hidden;
  width: 100%;
  border-radius: 4px;
  position: relative;
  transition: margin ease-in 100ms;
  flex-direction: column;
  border: 1px solid var(--primary_text);
  box-shadow: var(--form-shadow);
  color: var(--background);
  /* background: #d3d3d375; */

  .recipe__pic {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
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
      background: "none";
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      transition: all ease-in 100ms;
      z-index: -2;
    }
  }
  .recipe__name {
    padding: 7px 7px;
    position: absolute;
    bottom: 0;
    width: 100%;
    display: block;
    opacity: 1;
    background: transparent;
    color: #fff;
    z-index: 10;
    transition: opacity 200ms ease;
    backdrop-filter: blur(3px) brightness(90%);
    .name {
      color: #fff;
      display: block;
      font-size: 18px;
      line-height: 18px;
    }
    .remark {
      margin-top: 3px;
      height: 3rem;
      font-size: 14px;
      line-height: 16px;
      color: #fff;
      overflow: hidden;
      display: none;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  &.noimg {
    .recipe__pic {
      &::after {
      }
    }
    .recipe__name {
      backdrop-filter: none;
      .name {
        color: var(--primary_text);
        font-size: 20px;
        line-height: 20px;
      }
      .remark {
        color: var(--primary_text);
      }
    }
  }

  &[data-status="final"]::after {
    content: "Final";
    padding: 2px 15px;
    border-radius: 25px;
    background: var(--final-color);
    color: white;
    font-size: 1rem;
    line-height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 90;
    position: absolute;
    left: 4px;
    top: 4px;
  }

  &[data-status="wip"]::after {
    content: "WIP";
    padding: 2px 15px;
    border-radius: 25px;
    background: var(--wip-color);
    color: white;
    font-size: 1rem;
    line-height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 90;
    position: absolute;
    left: 4px;
    top: 4px;
  }

  &[data-status="draft"]::after {
    content: "Draft";
    padding: 2px 15px;
    border-radius: 25px;
    background: var(--draft-color);
    color: white;
    font-size: 1rem;
    line-height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 90;
    position: absolute;
    left: 4px;
    top: 4px;
  }

  @media (min-width: 961px) {
    .recipe__name {
      opacity: 0;
      .remark {
        display: -webkit-box;
      }
    }
    &.noimg {
      .recipe__name {
        opacity: 1;
        .name {
          font-size: 24px;
          line-height: 24px;
        }
      }
    }
    &:hover {
      .recipe__name {
        opacity: 1;
      }
    }
  }
`;

const RecipeList = styled(animated.ul)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 50vw;
  grid-gap: 20px 20px;

  @media (min-width: 767px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 35vw;
    grid-gap: 26px 26px;
  }

  @media (min-width: 961px) {
    grid-template-columns: 205px 205px 205px ;
    grid-auto-rows: 230px;
    grid-gap: 24px 24px;
  }

  @media (min-width: 1441px) {
    grid-template-columns: 205px 205px 205px 205px;
    grid-auto-rows: 230px;
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

  const onElementAppear = (el, index) =>
    spring({
      onUpdate: (val) => {
        el.style.opacity = val;
      },
      delay: index * 20,
    });

  const onExit = (el, index, removeElement) => {
    spring({
      config: { overshootClamping: true },
      onUpdate: (val) => {
        el.style.opacity = 1 - val;
      },
      delay: index * 20,
      onComplete: removeElement,
    });

    return () => {
      el.style.opacity = "";
      removeElement();
    };
  };

  return (
    <>
      <SEO title="Recipe Blog" type="website" image={"/screencap.png"} />
      {transitions.map(({ item, key, props }) => (
        <Flipper
          key="first_flipper"
          flipKey={`${query}-${type}-${filteredAry.length.toString()}`}
        >
          <RecipeList style={props} key={key}>
            {filteredAry.map((item) => (
              <Flipped
                key={item.slug}
                flipId={item.slug}
                onAppear={onElementAppear}
                onExit={onExit}
              >
                {(flippedProps) => (
                  <RecipeListItem>
                    <Link
                      href={`/recipe/[slug]`}
                      as={`/recipe/${item.slug}`}
                      passHref
                    >
                      <RecipeListLink
                        className={item.image && item.image[0] ? "" : "noimg"}
                        data-status={item.status}
                        {...flippedProps}
                      >
                        <div className="recipe__pic">
                          {item.image && item.image.length > 0 && (
                            <Image
                              src={`/assets/recipe/${item.image[0]}`}
                              layout="fill"
                              objectFit="cover"
                              className="recipe__pic"
                              alt={item.recipe_name}
                            />
                          )}
                        </div>
                        <span className="recipe__name">
                          <span className="name">{item.recipe_name}</span>
                          <span className="remark">{item.ingredients}</span>
                        </span>
                      </RecipeListLink>
                    </Link>
                  </RecipeListItem>
                )}
              </Flipped>
            ))}
          </RecipeList>
        </Flipper>
      ))}
    </>
  );
};

export async function getStaticProps() {
  const allRecipes = getAllRecipes([
    "recipe_name",
    "slug",
    "image",
    "date",
    "status",
    "serving",
    "serving_size",
    "type",
    "tags",
    "ingredients",
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
