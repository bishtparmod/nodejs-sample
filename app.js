var express = require('express')
var bodyParser= require('body-parser')
var http = require('http');
var debug = require('debug')('refill:server');
var database = require('./Config/connection')
var common = require('./Common/response')
var routes = require('./Router/index')
var app = express()

var server = http.createServer(app)

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index.html');
});


app.use('/api', (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      res.json({
        message: "Authorization token is not found." 
      })
      return;
    }
    const app_token = common.getAuthoriztionToken()
    if (token === app_token) {
      next();
    } else
    res.json({
      message: "Authorization token is not matched.",
      token:app_token
    })
  }, routes); 


server.listen(4000);
server.on('error', function(error){
  console.log("gvfg",error)
  res.json({
    error:error
  })
});
server.on('listening', function(){
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
  console.log(addr)
});

module.exports ={
  server
}