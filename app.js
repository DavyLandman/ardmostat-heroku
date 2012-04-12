
/**
 * Module dependencies.
 */

var express = require('express');
var gzippo = require('gzippo');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(app.router);
	app.use(express.bodyParser());
	app.use(gzippo.staticGzip(__dirname + '/public'));
	//app.use(express.static(__dirname + '/public'));
	app.use(gzippo.compress());
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
	app.get('*',function(req,res,next){
	  if(req.headers['x-forwarded-proto']!='https') {
		res.redirect(process.env.HTTPSHost+req.url)
	}
	  else
		next() /* Continue to other routes if we're not redirecting */
	});
});

// Routes
var mainRoutes = require('./routes/')
,  tempRoutes = require('./routes/temperature')
,  arduinoRoutes = require('./routes/arduino')
	
mainRoutes.init(app);
tempRoutes.init(app);
arduinoRoutes.init(app, {});



var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
