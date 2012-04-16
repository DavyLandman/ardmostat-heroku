$(function() {
	function getRecentTemperatures() {	
		var now = new Date();
		$.get('/RecentTemperatures?time=' + new Date(now.setSeconds(Math.round(now.getSeconds() / 4) * 4)).toISOString(), function (r) {
			var temperatures = [];
			var min = r[0][1];
			var max = r[0][1];
			for (var i =0; i < r.length; i++ ) {
				var currentTemp = r[i][1];
				if (currentTemp > max) {
					max = currentTemp;
				}
				else if (currentTemp < min) {
					min = currentTemp;
				}
				temperatures.push(currentTemp);
			}
			$('#recentTemperatures').sparkline(temperatures, { fill: false});
			$('#minTemperature').text(min);
			$('#maxTemperature').text(max);
		});
	}
	setInterval(getRecentTemperatures, 10000);
	getRecentTemperatures();
});
