
var plot;
var plotsize;
var radius;
var cx;
var cy;

$( document ).ready(function() { 

	var plotsize = 400;

	plot = SVG('plot').size(plotsize, plotsize);
	radius = (plotsize * 3/4)/2;
	cx = cy = plotsize / 2;
	
	var circle1 = plot.circle(2*radius).attr({'fill-opacity': 0, stroke: '#888', 'stroke-width': 1}).cx(cx).cy(cy);	
	var circle2 = plot.circle(2*radius*2/3).attr({'fill-opacity': 0, stroke: '#888', 'stroke-width': 1}).cx(cx).cy(cy);
	var circle3 = plot.circle(2*radius*1/3).attr({'fill-opacity': 0, stroke: '#888', 'stroke-width': 1}).cx(cx).cy(cy);
	
	var lon = plot.line(cx, 35, cy, plotsize-35).stroke({ width: 1, color: '#888' });
	var lat = plot.line(35, cx, plotsize-35, cy).stroke({ width: 1, color: '#888' });
		
	var north = plot.text("N").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(cx).cy(25);
	var east = plot.text("E").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(plotsize-25).cy(cy);
	var south = plot.text("S").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(cx).cy(plotsize-25);
	var west = plot.text("W").font({family: 'Helvetica Neue', size: 14, anchor: 'start'}).cx(25).cy(cy);
	
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
	for(var i = 0; i < details.length; i++) {
/* 		console.log(details[i].az,details[i].el); */
		}
	var polarpoint = polarPlot(0,0);
	console.log(polarpoint.x, polarpoint.y);
	var point = plot.circle(5).attr({fill: '#f00', 'fill-opacity': 1, 'stroke-width': 0}).cx(cx+polarpoint.x).cy(cy+polarpoint.y);
	var polarpoint = polarPlot(45,45);
	console.log(polarpoint.x, polarpoint.y);
	var point = plot.circle(5).attr({fill: '#ff0', 'fill-opacity': 1, 'stroke-width': 0}).cx(cx+polarpoint.x).cy(cy+polarpoint.y);
	var polarpoint = polarPlot(0,90);
	console.log(polarpoint.x, polarpoint.y);
	var point = plot.circle(5).attr({fill: '#0f0', 'fill-opacity': 1, 'stroke-width': 0}).cx(cx+polarpoint.x).cy(cy+polarpoint.y);
	}

// this function takes the elevation and azimuth of the position to plot
// as well as the radius of the polar graph
// and returns an x,y array relative to the centre of the polar graph
function polarPlot(elevation, azimuth) {
	// h is elevation measured from outside of polar plot, scaled to radius
	// (elevation is always 0-90deg
	var h = (radius/90) * (90-elevation);
	if (0 <= azimuth < 90) {
		var x =   (h * Math.cos(90 - azimuth));
		var y = - (h * Math.sin(90 - azimuth));
		}
	if (90 <= azimuth < 180) {
		var x =   (h * Math.cos(azimuth - 90));
		var y =   (h * Math.sin(azimuth - 90));  
		}
	if (180 <= azimuth < 270) {
		var x = - (h * Math.cos(270 - azimuth));
		var y =   (h * Math.sin(270 - azimuth));  
		}
	if (270 <= azimuth) {
		var x = - (h * Math.cos(azimuth - 270));
		var y = - (h * Math.sin(azimuth - 270));  
		}
	var polarpoint = {'x':x,'y':y};	
	return polarpoint;
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