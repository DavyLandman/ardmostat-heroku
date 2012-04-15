$(function() {
	var now = new Date();
	$.get('/RecentTemperatures?time=' + new Date(now.setSeconds(Math.round(now.getSeconds() / 4) * 4)).toISOString(), function (r) {
		var temperatures = [];
		for (var i =0; i < r.length; i++ ) {
			temperatures.push(r[i][1]);
		}
		$('#currentTemperature').sparkline(temperatures, { fill: false});
	});
});
