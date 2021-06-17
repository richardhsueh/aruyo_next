const images = require("remark-images");
const emoji = require("remark-emoji");
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
  },
  webpack5: false
});
