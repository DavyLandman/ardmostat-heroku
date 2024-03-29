var orm = require('orm');
var rcon = require('../utils/rcon');
var gzippo = require('gzippo');
var connectionString = 'postgresql://node_temp:report@localhost/Thermostat';
var Temp;
var db = orm.connect(connectionString, function( success, db) {
	if (!success) {
		console.log('Could not connect the database!\n\t%d:%s', db.number, db.message);
		return;
	}
	Temp = db.define("temperature", {
		"occurance":  { "type": "date" },
		"temperature": { "type": "float"}
	});
	Temp.sync();
});

var pg = require('pg');


exports.init = function (app, temperatures) {

	app.get('/Temperature', function(req, res) {
		res.render('temperature', { 
			title: 'Temperature information', 
			pagescript: ['/javascripts/temperature.js', '/javascripts/dygraph-combined.js']
		});
	});

	app.get('/RecentTemperatures', rcon.ajaxRequired, gzippo.compress(), function (req, res) {
		res.json(temperatures.get());
	});
	app.get('/CurrentTemperature', rcon.ajaxRequired, function (req, res) {
		res.send(temperatures.getLast().toString());
	});


	app.get('/Temperature/Range/:start/:stop', rcon.ajaxRequired, gzippo.compress(), function(req, res) {
		if (typeof(Temp) == 'undefined') {
			console.log("Temp orm object is not defined yet?");
			res.send("Error with database connection", 500);
			return;
		}
		pg.connect(connectionString, function (err, client) {
			client.query('SELECT occurance, temperature FROM temperature WHERE '+
			' occurance > $1 AND occurance < $2', [new Date(req.params.start), new Date(req.params.stop)], 
			function (err, result) {
				if (err) {
					console.log(err);
					res.send("Something went wrong", 500);
					return;
				}
				if (result.rowCount > 0) {
					resArray = [];
					for (var tIndex = 0, t; t = result.rows[tIndex++];) {
						resArray.push([t.occurance, t.temperature]);
					}
					res.json(resArray);
				}
				else {
					res.send("No temperatures found in this range");
				}
			});
		});
	});
}
