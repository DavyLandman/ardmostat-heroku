var config = require('config')
,   temperatureLogger = require('temperature_logger');

exports.init = function (app, temperatureCache) {
	var lastNonce = -1;
	app.put("/temperature", function (req, res) {
		console.log(req);
		var body = req.getBody();		
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
};
