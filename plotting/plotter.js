$( document ).ready(function() { 

	var plot = SVG('plot').size(400, 400);
	
	var circle1 = plot.circle(300).attr({'fill-opacity': 0, stroke: '#888', 'stroke-width': 1}).cx(200).cy(200);	
	var circle2 = plot.circle(200).attr({'fill-opacity': 0, stroke: '#888', 'stroke-width': 1}).cx(200).cy(200);
	var circle3 = plot.circle(100).attr({'fill-opacity': 0, stroke: '#888', 'stroke-width': 1}).cx(200).cy(200);
	
	var lon = plot.line(200, 35, 200, 365).stroke({ width: 1, color: '#888' });
	var lat = plot.line(35, 200, 365, 200).stroke({ width: 1, color: '#888' });
		
	var north = plot.text("N").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(200).cy(25);
	var east = plot.text("E").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(375).cy(200);
	var south = plot.text("S").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(200).cy(375);
	var west = plot.text("W").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(25).cy(200);
	
	$('#details').html("Loading...");
	
	var jqxhr = $.getJSON( "../predict_api.php", function(pass) {
		$('#details').html("Loaded");
		writeDetails(pass);
		drawPass(pass.details);
		})
		.fail(function() {
		console.log( "Problem retrieving data" );
		});

	});

function writeDetails(pass) {
	str = 'Satellite Name: ' + pass.satname + '<br>';
	str = str + 'AOS: ' + pass.aos.Julian2Date() + '<br>';
	str = str + 'TCA: ' + pass.tca.Julian2Date() + '<br>';
	str = str + 'LOS: ' + pass.los.Julian2Date() + '<br>';
	str = str + 'Max Elevation: ' + pass.max_el + '<br>';
	str = str + 'AOS Azimuth: ' + pass.aos_az + '<br>';
	str = str + 'LOS Azimuth: ' + pass.los_az + '<br>';
	str = str + 'Orbit: ' + pass.orbit + '<br>';
	str = str + 'Max Elevation Azimuth: ' + pass.maxel_az + '<br>';
	str = str + 'Visibility: ' + pass.vis + '<br>';
	str = str + 'Max Apparent Magnitude: ' + pass.max_apparent_magnitude + '<br>';
	$('#details').html(str);	
	}

function drawPass(details) {
	foreach (details as detail) {
		console.log(detail);
		}
	}
	
Number.prototype.Julian2Date = function() {
	var X = parseFloat(this)+0.5;
	var Z = Math.floor(X); //Get day without time
	var F = X - Z; //Get time
	var Y = Math.floor((Z-1867216.25)/36524.25);
	var A = Z+1+Y-Math.floor(Y/4);
	var B = A+1524;
	var C = Math.floor((B-122.1)/365.25);
	var D = Math.floor(365.25*C);
	var G = Math.floor((B-D)/30.6001);
	//must get number less than or equal to 12)
	var month = (G<13.5) ? (G-1) : (G-13);
	//if Month is January or February, or the rest of year
	var year = (month<2.5) ? (C-4715) : (C-4716);
	month -= 1; //Handle JavaScript month format
	var UT = B-D-Math.floor(30.6001*G)+F;
	var day = Math.floor(UT);
	//Determine time
	UT -= Math.floor(UT);
	UT *= 24;
	var hour = Math.floor(UT);
	UT -= Math.floor(UT);
	UT *= 60;
	var minute = Math.floor(UT);
	UT -= Math.floor(UT);
	UT *= 60;
	var second = Math.round(UT);	
	return new Date(Date.UTC(year, month, day, hour, minute, second));
 	};