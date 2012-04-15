exports.ajaxRequired = function (req, res, next) {
	if (req.xhr) {
		next();
	}
	else {
		res.send('This method is only intended for ajax calls', 500);
	}
};
