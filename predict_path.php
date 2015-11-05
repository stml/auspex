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

$tleFile = file('iss/iss.tle'); // Load up the ISS data file from NORAD
$tle     = new Predict_TLE($tleFile[0], $tleFile[1], $tleFile[2]); // Instantiate it
$sat     = new Predict_Sat($tle); // Load up the satellite data
$now     = Predict_Time::get_current_daynum(); // get the current time as Julian Date (daynum)

$zone   = 'Europe/Athens'; // time zone
$format = 'm-d-Y H:i:s';   // Time format from PHP's date() function

$results  = $predict->get_pass($sat, $qth, $now, 1);

echo "Satellite Name: " . $results->satname . "<br>";	
echo "AOS: " . Predict_Time::daynum2readable($results->aos, $zone, $format) . "<br>";
echo "TCA: " . Predict_Time::daynum2readable($results->tca, $zone, $format) . "<br>";
echo "LOS: " . Predict_Time::daynum2readable($results->los, $zone, $format) . "<br>";
echo "Max Elevation: " . $results->max_el . "<br>";
echo "AOS Azimuth: " . $results->aos_az . "<br>";
echo "LOS Azimuth: " . $results->los_az . "<br>";
echo "Orbit: " . $results->orbit . "<br>";
echo "Max Elevation Azimuth: " . $results->maxel_az . "<br>";
echo "Visibility: " . $results->vis . "<br>";
echo "Max Apparent Magnitude: " . $results->max_apparent_magnitude . "<br>";
echo "<br>";   

$detailcount = 0;
foreach ($results->details as $detail) {	
	$detailcount++;
	echo "Detail ".$detailcount." Time: " . Predict_Time::daynum2readable($detail->time, $zone, $format) . "<br>";
 
    }

?>