var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser');
  var unirest = require('unirest');
  var fs = require('fs');

var app = express();

var index = require('./routes/index');

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

setInterval(function(){
    unirest.get('http://www.apilayer.net/api/live?access_key=ad01a85a693bbec76f44fd09e12da448&format=1', function (req) {
    if (req.body.success) {
      var json = JSON.stringify(req.body);
      fs.writeFile("currency.json", json, function (err) {
        if (err) {
          console.log(err)
          return;
        }
      });
    }
  })
},5000);


app.configure('development', function () {
  app.use(express.errorHandler());
});

app.use('/', index);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});