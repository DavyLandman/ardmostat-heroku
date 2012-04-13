var config = require('config')
,   temperatureLogger = require('temperature_logger')
,   crypto = require('crypto')

exports.init = function (app, bodyParser, temperatureCache) {
	var lastNonce = -1;
	app.put("/temperature", function (req, res) {
		var body = req.body;		
		console.log(body);
		var contents = enc.decrypt(body, config.key);
		var temperature = contents.getTemperature();
		var nonce = contents.getNonce();
		if (nonce <= lastNonce) {
			console.log("Invalid Nonce received");	
			res.send("Error", 500);
			return;
		}
		lastNonce = nonce;
		temperatureCache.send(temperature);
		temperatureLogger.send(temperature);
		res.send("1");
	});

	bodyParser.parse["application/octet-stream"] = function (req, options, fn) {
		var buf = new Buffer(parseInt(req.header("Content-Length")));
		var offset = 0;
		req.on('data', function (chunk) { 
			chunk.copy(buf, offset);
			offset += chunk.length;
		});
		req.on('end', function () {
			if (offset == buf.length) {
				req.body = buf;
			}
			fn();
		});

	}
};
