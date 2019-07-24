const site = process.env.SITE;
const baseUrl = `/games/${site}`;

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      css: {
        camelCase: 'dashesOnly'
      }
    }
  },
  baseUrl
};
