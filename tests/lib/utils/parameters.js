var fs = require('fs');
var child_process = require('child_process');
var spawn = child_process.spawn;
var execSync = child_process.execSync;

var path = require('path');
var config = require('../config');

var branchFileName = config.branchFileName;

module.exports = {
  getBranchName: function() {
    var branchName = 'master';

    if(process.env.TRAVIS === 'true') {
      branchName = process.env.TRAVIS_BRANCH;

      if(branchName === 'master') { // for pull-requests
        // read branchName
        if(fs.existsSync(branchFileName)) {
          branchName = fs.readFileSync(branchFileName).toString();
        }
      }
    } else {
      // get branchName
      branchName = execSync('git rev-parse --abbrev-ref HEAD').toString();
    }

    return branchName.trim();
  }
};
