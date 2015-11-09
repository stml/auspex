<?

date_default_timezone_set('Europe/Athens');

require_once 'Predict.php';
require_once 'Predict/Sat.php';
require_once 'Predict/QTH.php';
require_once 'Predict/Time.php';
require_once 'Predict/TLE.php';

$predict  = new Predict();
$qth      = new Predict_QTH();
$qth->alt = 0; // Altitude in meters

// Athens, Kolonaki
$qth->lat = 37.97895;   // Latitude North
$qth->lon = 23.74606; // Longitude East

$tleFile = file('iss/iss_2000.tle'); // Load up the ISS data file from NORAD
$tle     = new Predict_TLE($tleFile[0], $tleFile[1], $tleFile[2]); // Instantiate it
$sat     = new Predict_Sat($tle); // Load up the satellite data
$now     = Predict_Time::get_current_daynum(); // get the current time as Julian Date (daynum)

$timestamp = strtotime('01-01-2000 00:00');
$julianDay = $timestamp / 86400 + 2440587.5;
$now = $julianDay;

$zone   = 'Europe/Athens'; // time zone
$format = 'm-d-Y H:i:s';   // Time format from PHP's date() function

$results  = $predict->get_pass($sat, $qth, $now, 1);

echo json_encode($results);

?>