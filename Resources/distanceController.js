exports.distance = function(userLat, userLon, placeLat, placeLon) {
	Ti.API.info(userLat, userLon, placeLat, placeLon);
	function toRad(x) {
	    return x * Math.PI / 180;
	}
  
	var R = 6371; // kilometres
	var φ1 = toRad(userLat);
	var φ2 = toRad(placeLat);
	var Δφ = toRad((placeLat-userLat));
	var Δλ = toRad((placeLon-userLon));
	
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	var distance = R * c;
	
	distance = Math.round(distance * 10) / 10;
	return distance;
};

/*Number.prototype.toRad = function() {
   return this * Math.PI / 180;
};*/
