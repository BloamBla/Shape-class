module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    files: [
      './workers/*.js',
      './spec/*.js',
      './src/*.js',
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      require.resolve('./'),
    ],
  });
};
