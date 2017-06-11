var express = require('express');
var app = express();
var fs = require('fs');
var unirest = require('unirest');

app.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

app.get('/currencymobile', function (req, res, next) {
  fs.readFile('currency.json', 'utf8', function (err, data) {
    var obj = JSON.parse(data);
    if(err){
      res.json({
        status:false,
        error:err
      })
      return;
    }
    res.json({
      status:true,
      currency: obj
    });
  });
});

app.get('/currencyweb', function (req, res, next) {
  console.log('hit route');
  unirest.get('http://www.apilayer.net/api/live?access_key=ad01a85a693bbec76f44fd09e12da448&format=1', function (req) {
    if (req.body.success) {
      var json = JSON.stringify(req.body);
      fs.writeFile("currency.json", json, function (err) {
        if (err) {
          console.log(err)
          res.json({
            success: false,
            status: "The file saved successfully!",
            error:err
          });
          return;
        }
        res.json({
          success: true,
          status: "The file saved successfully!"
        });
      });
    }
  })
});

app.get('/working', function (req, res) {
  res.json({
    success: true
  })
});

module.exports = app