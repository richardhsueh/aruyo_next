import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Image from "next/image";
import { animated, useTransition, config } from "react-spring";
import styled from "styled-components";
import { format } from "date-fns";
import queryString from "query-string";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import canvasTxt from "canvas-txt";

import { getRecipeBySlug, getAllRecipes } from "../../lib/api";
import useWindowSize from "../../lib/useWindowSize";
import { processIngredient } from "../../lib/recipeHelper";
import markdownToHtml from "../../lib/markdownToHtml";
import Layout from "../../components/layout";
import SEO from "../../components/seo";
import Carousel from "../../components/carousel";
import RecipeQueryContext from "../../lib/RecipeQueryContext";
import { roundRect } from "../../lib/canvasHelper";

const RecipeContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  padding: 0;
  justify-content: left;

  #main-content {
    margin-left: 0;
    width: auto;
  }

  ol {
    padding: 0px;
    list-style-position: outside;
    margin-top: 10px;
    margin-left: 30px;
    list-style-type: decimal-leading-zero;
    max-width: 650px;
    color: #222;
    li {
      margin-bottom: 0;
      font-size: 17px;
      line-height: 20px;
      margin: 10px 0;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }

  ul {
    padding: 0px;
    list-style: disc;
    list-style-position: outside;
    /* margin-top: 10px;
    margin-left: 20px; */
    color: #222;
    li {
      line-height: 20px;
      margin: 10px 0;
    }
  }
  .recipe__header {
    display: flex;
    justify-content: space-between;
    align-items: left;
    flex-direction: column;
  }
  .mkd {
    h2,
    h3 {
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 2px;
      color: #222;
      margin-top: 25px;
    }
    ul,
    ol,
    li {
      font-family: "Open Sans", sans-serif;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
    }
    ul,
    ol {
      margin: 10px auto 20px 30px;
    }
  }
  @media (min-width: 768px) {
    flex-direction: row;
    /* padding: 0 60px 30px; */
    #main-content {
      /* margin-left: 30px; */
      width: 500px;
    }
    h6 {
      /* margin-bottom: 0px; */
    }
    .recipe__header {
      align-items: center;
      flex-direction: row;
    }
  }
`;

const ImageFrame = styled.div`
  /* min-width: 350px; */
  width: 100% !important;
  max-height: initial;
  transition: all ease-in 200ms;
  margin: 0 0 20px 0;
  border: 1px solid #222;
  position: relative;
  display: flex;
  border-radius: 4px;
  overflow: hidden;

  &:before {
    content: "";
    float: left;
    padding-top: 100%;
  }

  &[data-status="final"]::after {
    content: "Final";
    padding: 5px 15px;
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
    content: "Work In Progress";
    padding: 5px 15px;
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
    padding: 5px 15px;
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
  .gatsby-image-wrapper,
  .carousel {
    /* min-width: 350px; */
    width: 100% !important;
    max-height: initial;
    transition: all ease-in 200ms;
    /* overflow: hidden; */
    &:before {
      content: "";
      float: left;
      padding-top: 100%;
    }
  }

  @media (min-width: 767px) {
    order: 2;
    min-width: 230px;
    width: 230px !important;
    max-height: 230px;
    margin-right: 25px;
    .gatsby-image-wrapper,
    .carousel {
      order: 2;
      min-width: 230px;
      width: 230px !important;
      max-height: 230px;
      /* margin: 0 30px 10px 0; */
    }
  }

  @media (min-width: 1441px) {
    order: 2;
    min-width: 350px;
    width: 350px !important;
    max-height: 350px;
    margin-right: 30px;
    .gatsby-image-wrapper,
    .carousel {
      order: 2;
      min-width: 350px;
      width: 350px !important;
      max-height: 350px;
    }
  }
`;

const MetaData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;

  > h1 {
    font-weight: bold;
    font-size: 30px;
    line-height: 36px;
    color: #222;
    margin-bottom: 10px;
  }

  > h3 {
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
    color: #222;
    margin-bottom: 10px;
  }

  .servingBlk {
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
    color: #222;
    .servingSize {
      font-size: 17px;
      width: 70px;
      border: 1px solid #222;
      border-radius: 3px;
      color: #222;
      background: var(--bg);
      text-align: center;
      &::-webkit-inner-spin-button {
        opacity: 1;
      }
    }
  }
`;

const IngredientsBlk = styled.div`
  margin: 20px 0 35px;
  max-width: 600px;
  > span {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 2px;
    color: #222;
  }
  .ingredient__group {
    margin-top: 10px;
    > span {
      display: block;
      text-decoration: underline;
      font-weight: normal;
      font-size: 16px;
      line-height: 19px;
      color: #222;
    }
  }
  ul {
    margin-left: 0;
    padding: 0;
    column-count: 2;
    margin-top: 10px;
    .ingredient {
      list-style: none;
      width: 100%;
      padding: 0;
      display: inline-flex;
      align-items: center;
      margin: 3px 0;
      list-style-position: inside;
      -webkit-column-break-inside: avoid;
      page-break-inside: avoid;
      break-inside: avoid;

      label {
        font-size: 14px;
        line-height: 17px;
        cursor: pointer;
        display: flex;
        input[type="checkbox"] {
          display: none;
          &:checked ~ span::after {
            opacity: 1;
          }
        }
        span {
          position: relative;
          display: inline-flex;
          align-items: center;
          &::before {
            display: inline-block;
            content: "";
            height: 12px;
            width: 12px;
            border: 1.5px solid #222;
            margin-right: 10px;
            box-sizing: content-box;
          }
          &::after {
            opacity: 0;
            content: "";
            background: #222;
            height: 18px;
            width: 1px;
            transform: rotate(45deg);
            position: absolute;
            left: 7px;
            border-radius: 1px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    margin: 20px 0 20px;
    ul {
      column-count: 1;
    }
  }

  @media screen and (min-width: 1200px) {
    max-width: initial;
  }
`;

export default function Post({ post, morePosts, preview, allRecipes }) {
  const { type, query, search, setRecipeJson } = useContext(RecipeQueryContext);
  const [serving, setServing] = useState(post.serving || 1);

  const transitions = useTransition(null, null, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    from: { opacity: 1 },
    config: config.stiff,
  });

  useEffect(() => {
    setRecipeJson(allRecipes);
  }, [allRecipes]);

  useEffect(() => {
    if (process.browser && queryString.parse(window.location.search).s) {
      setServing(queryString.parse(window.location.search).s);
    }
  }, []);

  const size = useWindowSize();

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const onChangeHandler = (e) => {
    setServing(e.target.value);
    window.history.replaceState(
      {},
      "",
      location.pathname + "?s=" + e.target.value
    );
  };

  const onBlurHandler = (e) => {
    if (!serving) {
      setServing(1);
      window.history.replaceState({}, "", location.pathname);
    }
  };

  const previewImg = `/assets/recipe/${post.slug}-preview.png`;

  return (
    <Layout>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <SEO
            title={`${post.recipe_name} Recipe`}
            description={post.description}
            image={previewImg}
            url={`/recipe/${post.slug}`}
            type="article"
          />
          {transitions.map(({ item, key, props }) => (
            <RecipeContainer style={props} key={key}>
              <div>
                {size.width > 768 &&
                  post.image &&
                  post.image.map((o, index) => {
                    return (
                      <ImageFrame data-status={status}>
                        <Image
                          key={index}
                          src={o}
                          layout="fill"
                          objectFit="cover"
                        />
                      </ImageFrame>
                    );
                  })}
                {size.width <= 768 && post.image && (
                  <ImageFrame data-status={status}>
                    {post.image && post.image.length > 1 && (
                      <div className="carousel">
                        <Carousel autoScroll>
                          {post.image.map((o, index) => (
                            <Image
                              key={index}
                              src={o}
                              layout="fill"
                              objectFit="cover"
                            />
                          ))}
                        </Carousel>
                      </div>
                    )}
                    {post.image && post.image.length === 1 && (
                      <Image
                        src={post.image[0]}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                  </ImageFrame>
                )}
              </div>

              <div id="main-content">
                <MetaData className="section">
                  <h1>{post.recipe_name}</h1>
                  <h3>{format(new Date(post.date), "yyyy - MM - dd")}</h3>
                  <div className="servingBlk">
                    <strong>Serving Size: </strong>
                    <input
                      className="servingSize"
                      type="number"
                      value={serving}
                      onChange={onChangeHandler}
                      onBlur={onBlurHandler}
                      min={1}
                    />{" "}
                    <span>{post.serving_size && post.serving_size}</span>
                  </div>
                </MetaData>
                <IngredientsBlk>
                  <span>Ingredients</span>
                  {post.ingredients.map((group, index) => (
                    <div
                      className="ingredient__group"
                      key={`ingredient__group${index}`}
                    >
                      <span>{group.group}</span>
                      <ul>
                        {group.ingredient.map(
                          ({ ingredientName, amount, scale }, index) => (
                            <li key={index} className="ingredient">
                              <label>
                                <input type="checkbox" name={ingredientName} />
                                <span>
                                  {`${
                                    amount
                                      ? Math.round(amount * serving * 10) / 10 +
                                        " "
                                      : ""
                                  }`}
                                  {`${scale ? scale + " " : ""}`}
                                  {`${ingredientName}`}
                                </span>
                              </label>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </IngredientsBlk>
                <div
                  className="section mkd"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </RecipeContainer>
          ))}
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
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
  const post = getRecipeBySlug(params.slug, [
    "recipe_name",
    "slug",
    "image",
    "date",
    "serving",
    "serving_size",
    "type",
    "description",
    "tags",
    "ingredients",
    "content",
  ]);
  const content = await markdownToHtml(post.content || "");

  const width = 540;
  const height = 281;

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

    // if (post.serving_size) {
    //   const servingSize = `Serving: ${post.serving} * ${post.serving_size}`;
    //   canvasTxt.fontSize = 18;
    //   canvasTxt.lineHeight = 18;
    //   canvasTxt.fontWeight = "regular";
    //   canvasTxt.drawText(context, servingSize, 280, 160, 230, 200);
    // }

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
        `./public/assets/recipe/${post.slug}-preview.png`,
        buffer
      );
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
    fs.writeFileSync(`./public/assets/recipe/${post.slug}-preview.png`, buffer);
  }

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
      post: {
        ...post,
        ingredients: processIngredient(post.ingredients, post.serving),
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllRecipes(["slug"]);

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      };
    }),
    fallback: false,
  };
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
