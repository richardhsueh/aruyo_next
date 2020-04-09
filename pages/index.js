import Head from "next/head";
import styled from "styled-components";
import Layout from "../components/layout";
import Link from "next/link";
import { animated } from "react-spring";
import { getAllPosts } from "../lib/api";
import { processIngredient } from "../lib/recipeHelper";

const RecipeListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  overflow: hidden;
  width: 100%;
  height: 305px;
  margin: 7.5px;
  border-radius: 20px;
  position: relative;
  transition: margin ease-in 100ms;
  flex-direction: column;
  border: 1.5px solid var(--textNormal);

  .recipe__pic {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 60%;

    .gatsby-image-wrapper {
      z-index: -1;
      top: 0;
      left: 0;
    }
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
    padding: 5px 10px;
    position: absolute;
    bottom: 0;
    height: 40%;
    width: 100%;
    display: block;
    border-top: 1.5px solid var(--textNormal);
    /* border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px; */
    background: var(--bg-secondary);
    color: var(--textNormal);
    .name {
      /* height: 50%; */
      display: block;
    }
    .remark {
      margin-top: 5px;
      height: 3.3rem;
      font-size: 0.9rem;
      line-height: 1.1rem;
      color: #b3b3b3;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  @media (min-width: 576px) {
    margin: 7.5px;
    .recipe__pic {
      height: 70%;
    }
    .recipe__name {
      height: 30%;
      .remark {
        height: 2.2rem;
        -webkit-line-clamp: 2;
      }
    }
  }

  @media (min-width: 768px) {
    margin: 7.5px;
    height: 305px;
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

const RecipeList = styled.ul`
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

const Home = ({ allPosts }) => {
  console.log(allPosts);
  return (
    <Layout>
      <RecipeList>
        {allPosts.map((item, key) => (
          <Link prefetch href={item.pagePath} passHref>
            <RecipeListLink key={item.slug} href={item.pagePath}>
              <RecipeListItem key={key} hrbg={item.image}>
                <div className="recipe__pic">
                  {item.image && (
                    <img
                      src={item.image}
                      className="recipe__pic"
                      style={{
                        position: "relative",
                        display: "block",
                        width: "100%",
                        height: "100%",
                      }}
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
  const allPosts = getAllPosts([
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

  return {
    props: {
      allPosts: allPosts.map((post) => {
        return {
          ...post,
          ingredients: processIngredient(post.ingredients, post.serving).map(item => item.ingredient.map(o => o.ingredientName).join(' ‧ ')).join(' ‧ '),
        };
      }),
    },
  };
}

export default Home;
