var config = require('../config')
,   temperatureLogger = require('../temperature_logger')
,   crypto = require('crypto')

exports.init = function (app, bodyParser, temperatureCache) {
	var lastNonce = -1;
	app.put("/temperature", function (req, res) {
		var body = req.body;		
		if (body.length == 16) {
			var data = new Buffer(body.toString('binary') + 'paddingbug', 'binary');
			var decrypter = crypto.createDecipheriv('AES-128-ECB', config.key, '');
			var result = new Buffer(decrypter.update(data)); // first block is all we need
			console.log(result);
			var temperature = result.readUInt8(0) + (result.readUInt8(1) / 100);
			var nonce = result.readUInt32LE(11);
			if (nonce <= lastNonce) {
				console.log("Invalid Nonce received");	
				res.send("Error", 500);
				return;
			}
			lastNonce = nonce;
			temperatureCache.send(temperature);
			//temperatureLogger.send(temperature);
			res.send("1");
		}
		else {
			console.log("Invalid packet length");	
			res.send("Error", 500);
		}
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
