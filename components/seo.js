/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

const GOOGLE_TRACKING_ID = "UA-158052933-1";
const SITE_URL = "https://recipe.aruyo.site";

const siteMetadata = {
  title: `Aruyo*`,
  description: `This is a blog for all kinds of recipe.`,
  author: `R.H.`,
  siteUrl: SITE_URL,
};

function SEO({ description, lang, meta, title, image, url = "", type }) {
  const metaDescription = description || siteMetadata.description;

  const metas = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: `${title} | ${siteMetadata.title}`,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:url`,
      content: `${siteMetadata.siteUrl}${url}`,
    },
    {
      property: `og:image`,
      content: `${siteMetadata.siteUrl}${image}`,
    },
    {
      property: `og:image:alt`,
      content: title,
    },
    {
      property: `og:type`,
      content: type,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: siteMetadata.author,
    },
    {
      name: `twitter:title`,
      content: `${title} | ${siteMetadata.title}`,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ].concat(meta);

  return (
    <Head>
      <title>{`${title} | ${siteMetadata.title}`}</title>
      {metas.map((o, i) =>
        React.createElement("meta", { ...o, key: `${i}${o.name}` })
      )}
    </Head>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  image: "",
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
