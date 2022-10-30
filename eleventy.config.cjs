module.exports = function(eleventyConfig) {
  return {
    templateFormats: ['njk'],
    dir: {
      input: '11ty',
      // Relative to input
      includes: '../views',
      output: 'public',
    },
  }
}
