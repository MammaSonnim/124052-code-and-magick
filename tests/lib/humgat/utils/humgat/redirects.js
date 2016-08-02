var slice = Array.prototype.slice;
var fs = require('fs');

var extname = function(path) {
  var md = /(\.\w+)$/.exec(path);

  if(md) {
    return md[1];
  } else {
    return null;
  }
};

var MIME_TYPES = {
  '.css': 'text/css',
  '.json': 'application/json',
  '.js': 'text/javascript'
};

var getMimeType = function(redirect) {
  var mime = (redirect.mime || redirect.mimeType);
  var ext = extname(redirect.file);

  mime || (mime = (MIME_TYPES[ext] || 'application/octet-stream'));

  return mime;
};

var checkRequest = function(request, redirect) {
  if(redirect.method) {
    if(redirect.method !== request.method) {
      return false;
    }
  }

  if(redirect.url) {
    if(redirect.url !== request.url) {
      return false;
    }
  }

  if(redirect.urlPattern) {
    if(request.url.indexOf(redirect.urlPattern) === -1) {
      return false;
    }
  }

  return true;
};

var checkRedirect = function(request, redirect) {
  if(redirect.method) {
    if(redirect.method != request.method) {
      return false;
    }
  }

  if(redirect.redirect || redirect.file) {
    var path = redirect.redirect || '/' + redirect.file;

    if(path !== request.url) {
      return false;
    }
  }

  return true;
};

var redirects = function() {

  var args = slice.call(arguments);
  var humgat = this;

  return this.on('humgat.start', function() {
    var server = require('webserver').create();
    var config = this.config;

    humgat.emit('resource.server.start');

    server.listen(config.stubServer, function(request, response) {
      var redirect, path, mime, content;

      humgat.emit('resource.server.requested', request);

      for(var i = 0; i < args.length; ++i) {
        if(checkRedirect(request, args[i])) {
          redirect = args[i];
          break;
        }
      }

      if(redirect) {
        humgat.emit('resource.server.found-redirect', redirect);

        if(redirect.file) {
          path = config.stubDataDir + redirect.file;
          mime = getMimeType(redirect);
          content = fs.read(path);

          humgat.emit('resource.server.read', path, content.length + ' byte(s)');

          response.status = redirect.status || 200;
          response.setHeader('Content-Type', mime);
          response.setHeader('Access-Control-Allow-Origin', '*');
          response.write(content);
          response.close();
        } else {
          response.status = 404;
          response.close();
        }
      } else {
        humgat.emit('resource.server.failure');
      }
    });
  }).on('resource.requested', function(requestData, networkRequest) {
    var config = this.config;
    var redirect, path, redirectUrl;

    for(var i = 0; i < args.length; ++i) {
      if(checkRequest(requestData, args[i])) {
        redirect = args[i];
        break;
      }
    }

    if(redirect) {
      path = redirect.path || ('/' + redirect.file);
      redirectUrl = 'http://' + config.stubServer + path;

      this.emit('resource.redirect', redirectUrl);

      networkRequest.changeUrl(redirectUrl);
    }
  });

  return this;
};

var addRedirects = function(humgat) {
  humgat.redirects = redirects;
};

module.exports = addRedirects;
