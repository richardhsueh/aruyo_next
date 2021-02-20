const images = require("remark-images");
const emoji = require("remark-emoji");
const withPWA = require("next-pwa");
const withMDX = require("@zeit/next-mdx")({
  options: {
    mdPlugins: [images, emoji],
  },
});

module.exports = withPWA(
  withMDX({
    pageExtensions: ["js", "jsx", "mdx"],
    pwa: {
      dest: "public",
    },
  })
);
