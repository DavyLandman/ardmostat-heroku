exports.recentTemperatures = {
	temps: [],
	send: function(newTemp) {
		if (this.temps.length >= 20) {
			this.temps = temps.slice(this.temps.length-19) 
		}
		this.temps.push([new Date(), newTemp]);
	},
	get: function() { return this.temps; },
	getLast: function() { var lastTemp =  this.temps[this.temps.length - 1]; if (lastTemp) return lastTemp[1]; else return "unkown"; }
};

