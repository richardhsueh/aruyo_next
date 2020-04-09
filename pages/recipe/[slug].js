import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import Layout from "../../components/layout";
import Head from "next/head";
import markdownToHtml from "../../lib/markdownToHtml";
import { processIngredient } from "../../lib/recipeHelper";

export default function Post({ post, morePosts, preview }) {
  console.log(post.ingredients);
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
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
            {/* <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              /> */}
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </article>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
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
  const posts = getAllPosts(["slug"]);

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
