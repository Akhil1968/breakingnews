var express = require('express');
var handlebars = require('express-handlebars');
var bodyparser = require('body-parser');
var session = require('express-session');
var socketIO = require('socket.io');
var http = require('http');
var app = express();

//socketio
var httpServer = http.createServer(app);
var io = socketIO(httpServer);

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
  	console.log('a user disconnected');
  });

  // socket.on('chat-message', function(msg){
  //   console.log('message: ' + msg);
  //   io.emit('chat-message', 'server broadcast ' + msg);
  // });
});
//socketio

app.use(express.static(__dirname + "/public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use(session({secret: "secret",  resave : true,  saveUninitialized : false}));
 
var routes = require('./routes/routes.js');

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({}));

var broadcastHandler = function(req, res){
	var newsTitleValue = req.body.title;
	var newsArticleValue = req.body.article;
	
	console.log("received newsTitleValue  as " + newsTitleValue);
    // broadcast the news
    io.emit('news-article', newsTitleValue);
	//req.session.destroy();
	res.render('newNews.handlebars', {userName:req.session.userName});
}

app.get('/', routes.breakingNewsPageHandler);
app.get('/adminLogin', routes.loginPageHandler);
app.get('/newNews', routes.newNewsPageHandler);
app.post('/broadcast', broadcastHandler);

var port = process.env.PORT || 3000;
httpServer.listen(port, function(){
	console.log('HTTP server is listening on port: ' + port);
});