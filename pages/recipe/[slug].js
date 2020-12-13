import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { animated, useTransition, config } from "react-spring";
import styled from "styled-components";
import { format } from "date-fns";
import queryString from "query-string";

import { getRecipeBySlug, getAllRecipes } from "../../lib/api";
import { processIngredient } from "../../lib/recipeHelper";
import markdownToHtml from "../../lib/markdownToHtml";
import Layout from "../../components/layout";

const RecipeContainer = styled(animated.div)`
  h2,
  h3,
  h4 {
    margin-bottom: 10px;
    color: var(--primary_text);
  }

  h2 {
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 2px;
  }
  h3 {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 2px;
    margin-top: 10px;
  }
  h6 {
    color: var(--primary_text);
    font-weight: normal;
    margin-bottom: 10px;
  }

  ol {
    padding: 0px;
    list-style-position: outside;
    margin-top: 10px;
    margin-left: 30px;
    list-style-type: decimal-leading-zero;
    max-width: 650px;
    color: var(--primary_text);
    li {
      margin-bottom: 0;
      font-size: 17px;
      line-height: 20px;
      margin: 7px 0;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }

  ul {
    padding: 0px;
    list-style: disc;
    list-style-position: outside;
    margin-top: 10px;
    margin-left: 20px;
    color: var(--primary_text);
    li {
      line-height: 20px;
      margin-bottom: 0;
    }
  }
  .recipe__header {
    display: flex;
    justify-content: space-between;
    align-items: left;
    flex-direction: column;
  }
  .mkd {
    margin-top: 20px;
    ul,
    ol,
    li {
      font-family: "Open Sans", sans-serif;
    }
    ul,
    ol {
      margin: 10px auto 20px 30px;
    }
  }
  @media (min-width: 768px) {
    h6 {
      margin-bottom: 0px;
    }
    .recipe__header {
      align-items: center;
      flex-direction: row;
    }
  }
`;

const MetaData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  img {
    order: 1;
    margin: 0 0 20px 0;
    min-width: 350px;
    width: 100% !important;
    max-height: initial;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    &:before {
      content: "";
      float: left;
      padding-top: 100%;
    }
  }
  .specification {
    order: 2;
    width: 100%;
    .servingBlk {
      font-size: 17px;
      color: var(--primary_text);
      strong {
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 2px;
      }
      .servingSize {
        font-size: 17px;
        width: 50px;
        border: 1px solid var(--primary_text);
        color: var(--primary_text);
        background: var(--bg);
        text-align: center;
      }
    }
  }

  @media (min-width: 576px) {
    flex-direction: column;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    img {
      order: 2;
      min-width: 350px;
      width: 350px !important;
      max-height: 350px;
      /* margin: 0 30px 10px 0; */
    }
    .specification {
      order: 1;
      margin-top: 0px;
      width: 100%;
      .servingBlk {
        strong {
          margin-bottom: 10px;
        }
      }
    }
  }

  @media (min-width: 992px) {
    flex-direction: row;
    .specification {
      .servingBlk {
        strong {
          margin-bottom: 0px;
        }
      }
    }
  }

  @media (min-width: 1200px) {
    flex-direction: row;
  }
`;

const IngredientsBlk = styled.div`
  margin: 20px 0;
  max-width: 600px;
  > span {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 2px;
    color: var(--primary_text);
  }
  .ingredient__group {
    margin-top: 10px;
    > span {
      display: block;
      text-decoration: underline;
      color: var(--primary_text);
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
        font-size: 16px;
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
            border: 1.5px solid var(--primary_text);
            margin-right: 10px;
            box-sizing: content-box;
          }
          &::after {
            opacity: 0;
            content: "";
            background: var(--primary_text);
            height: 18px;
            width: 1.5px;
            transform: rotate(45deg);
            position: absolute;
            left: 7px;
            top: 0.5px;
            border-radius: 1px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    margin: 20px 0 0 0;
    ul {
      column-count: 1;
    }
  }
`;

export default function Post({ post, morePosts, preview }) {
  const transitions = useTransition(null, null, {
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    from: { opacity: 0 },
    config: config.stiff,
  });

  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  let s;
  if (process.browser) {
    s = queryString.parse(window.location.search).s;
  }
  const [serving, setServing] = useState(post.serving || 1);

  useEffect(() => {
    if (s) {
      setServing(s);
    }
  }, [s]);

  return (
    <Layout>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article className="mb-32">
            <Head>
              <title>{post.recipe_name} Recipe | Aruyo*</title>
            </Head>
            {transitions.map(({ item, key, props }) => (
              <RecipeContainer style={props} key={key}>
                <div className="recipe__header">
                  <h2>{post.recipe_name}</h2>
                  <h6>{format(new Date(post.date), "yyyy - MM - dd")}</h6>
                </div>
                <MetaData className="section">
                  <div className="specification">
                    <div className="servingBlk">
                      <strong>Serving Size: </strong>
                      <input
                        className="servingSize"
                        type="number"
                        value={serving}
                        onChange={(e) => {
                          setServing(e.target.value);
                          window.history.replaceState(
                            {},
                            "",
                            location.pathname + "?s=" + e.target.value
                          );
                        }}
                        onBlur={() => {
                          if (!serving) {
                            setServing(1);
                            window.history.replaceState(
                              {},
                              "",
                              location.pathname
                            );
                          }
                        }}
                        min={1}
                      />{" "}
                      <span>{post.serving_size && post.serving_size}</span>
                    </div>
                    <IngredientsBlk>
                      <span>Ingredients</span>
                      {post.ingredients.map((group, index) => (
                        <div
                          className="ingredient__group"
                          key={`ingredient__group${index}`}
                        >
                          <span>{group.group}</span>
                          <ul>
                            {group.ingredient.map((item, index) => (
                              <li key={index} className="ingredient">
                                <label>
                                  <input
                                    type="checkbox"
                                    name={item.ingredientName}
                                  />
                                  <span>
                                    {`${
                                      item.amount
                                        ? item.amount * serving + " "
                                        : ""
                                    }`}
                                    {`${item.scale ? item.scale + " " : ""}`}
                                    {`${item.ingredientName}`}
                                  </span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </IngredientsBlk>
                  </div>
                  {post.image && (
                    <img
                      src={post.image}
                      style={{ width: "auto", height: "auto" }}
                    />
                  )}
                </MetaData>
                <div
                  className="mkd"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              </RecipeContainer>
            ))}
          </article>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
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

  return {
    props: {
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
