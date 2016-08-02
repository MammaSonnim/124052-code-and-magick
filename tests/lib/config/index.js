// config/index.js
module.exports = {
  branchFileName: './branch-name',

  npmStart: require('./npm-start'),

  screenshots: 'tests/screenshots/',

  report: 'tests/index.html',

  treshold: 99.99,

  log_level: 'INFO',

  phantomjs: {
    // Default config for phantomjs step
    defaultStepOpts: { render: true },

    //
    url: 'http://localhost:8080',

    // Directory to store screenshots
    screenshots: "tests/screenshots/current/",

    // Filename to store results
    results: "tests/results.json",

    //
    shims: "tests/lib/phantomjs/utils/shims.js",

    // Page extents
    page: {
      width: 1024,
      height: 800
    },

    //
    stubServer: '127.0.0.1:8081',
    stubDataDir: 'tests/lib/phantomjs/data/',

    // Turn on if you need some debugging from phantomjs
    debug: true,

    tasks: {
      'module1-task2': require('./tasks/module1-task2'),
      'module3-task2': require('./tasks/module3-task2'),
      'module3-task3': require('./tasks/module3-task3'),
      'module4-task1': require('./tasks/module4-task1'),
      'module5-task1': require('./tasks/module5-task1')
    }
  }
};
