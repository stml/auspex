<?php
/**
 * Simple predictor for ISS passes over London at Midnight, January 1st 2000
 */

date_default_timezone_set('Europe/London');

require_once 'Predict.php';
require_once 'Predict/Sat.php';
require_once 'Predict/QTH.php';
require_once 'Predict/Time.php';
require_once 'Predict/TLE.php';

// Track execution time of this script
$start = microtime(true);

// The observer or groundstation is called QTH in ham radio terms
$predict  = new Predict();
$qth      = new Predict_QTH();
$qth->alt = 0; // Altitude in meters

// London
$qth->lat = 51.50735;   // Latitude North
$qth->lon = -0.12776; // Longitude East


// The iss.tle file is the first 3 lines of
// http://celestrak.com/NORAD/elements/stations.txt
// Make sure you update this content, it goes out of date within a day or two
$tleFile = file('iss_2000.tle'); // Load up the ISS data file from NORAD
$tle     = new Predict_TLE($tleFile[0], $tleFile[1], $tleFile[2]); // Instantiate it
$sat     = new Predict_Sat($tle); // Load up the satellite data

// AS HISTORICAL, WE NEED AN OLD "NOW"
// $now example: 2457330.9884202 (Wednesday 4th Nov 2015 13:44ish)

$timestamp = strtotime('01-01-2000');
$julianDay = $timestamp / 86400 + 2440587.5;
//$now     = Predict_Time::get_current_daynum(); // get the current time as Julian Date (daynum)
$now = $julianDay;

// You can modify some preferences in Predict(), the defaults are below
//
$predict->minEle     = 0; // Minimum elevation for a pass
// $predict->timeRes    = 10; // Pass details: time resolution in seconds
// $predict->numEntries = 20; // Pass details: number of entries per pass
// $predict->threshold  = -6; // Twilight threshold (sun must be at this lat or lower)

// Get the passes and filter visible only, takes about 4 seconds for 10 days
$results  = $predict->get_passes($sat, $qth, $now, 10);

$filtered = $predict->filterVisiblePasses($results);

$zone   = 'Europe/London'; 		// Target time zone
$format = 'm-d-Y H:i:s';         // Time format from PHP's date() function

// Format the output similar to the heavens-above.com website
foreach ($filtered as $pass) {
    echo "AOS Daynum: " . $pass->visible_aos . "<br>";
    echo "AOS Time: " . Predict_Time::daynum2readable($pass->visible_aos, $zone, $format) . "<br>";
    echo "AOS Az: " . $predict->azDegreesToDirection($pass->visible_aos_az) . "<br>";
    echo "AOS El: " . round($pass->visible_aos_el) . "<br>";
    echo "Max Time: " . Predict_Time::daynum2readable($pass->visible_tca, $zone, $format) . "<br>";
    echo "Max Az: " . $predict->azDegreesToDirection($pass->visible_max_el_az) . "<br>";
    echo "Max El: " . round($pass->visible_max_el) . "<br>";
    echo "LOS Time: " . Predict_Time::daynum2readable($pass->visible_los, $zone, $format) . "<br>";
    echo "LOS Az: " . $predict->azDegreesToDirection($pass->visible_los_az) . "<br>";
    echo "LOS El: " . round($pass->visible_los_el) . "<br>";
    echo "Magnitude: " . number_format($pass->max_apparent_magnitude, 1) . "<br>";
    echo "<br>";
}

// How long did this take?
echo "Execution time:  " . number_format((microtime(true) - $start) * 1000, 2) . "ms<br>"; exit;
