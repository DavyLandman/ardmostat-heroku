$(function() {
	var now = new Date();
	$.get('/CurrentTemperature?time=' + new Date(now.setSeconds(Math.round(now.getSeconds() / 4) * 4)).toISOString(), function (r) {
		$('#currentTemperature').text(r);
	});
});
