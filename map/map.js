var startLoc = [40.461814, -80.010619];
var destLoc = [40.447321, -79.946805];
var mymap = L.map('mapid').setView(startLoc, 13);

//tile
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnJhbmRvbnBlayIsImEiOiJjanU3NTlmaG4xcXJnNDRwZHR0MWt5MmxuIn0.z24ELyhNLomU5c6yVWTCRg', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox.streets',
accessToken: 'pk.eyJ1IjoiYnJhbmRvbnBlayIsImEiOiJjanU3NTlmaG4xcXJnNDRwZHR0MWt5MmxuIn0.z24ELyhNLomU5c6yVWTCRg'
}).addTo(mymap);

//set icons
var destIcon = L.icon({
    iconUrl: 'dest.png',

    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var friendIcon = L.icon({
    iconUrl: 'closeFriends2.png',

    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var friendIcon2 = L.icon({
    iconUrl: 'friend.png',

    iconSize:     [20, 20], // size of the icon
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

//add startLoc and destLoc
var circle = L.circle(startLoc, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.2,
    radius: 1000
}).addTo(mymap);
//circle.bindPopup("<b>Common Starting</b><br>Showing friends in a 0.5 mile radius");
var circle2 = L.circle(destLoc, {
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.2,
    radius: 1000
}).addTo(mymap);
//circle2.bindPopup("<b>Common Destinations</b><br>Showing friends in a 0.5 mile radius");
var start = L.marker(startLoc).addTo(mymap);
start.bindPopup("<b>Start Location</b><br>Clayton Elementary School").openPopup();
var destination = L.marker(destLoc).addTo(mymap);
destination.bindPopup("<b>Destination</b><br>3555 Shadeland Avenue");

//set close friends
var closeFriends = [
[[40.461618, -80.011090], [40.455331, -80.003832], "<b>Close Friend: Clement</b><br>Start: Pittsburgh Clayton Academy<br>End: 1210 Lorraine Street<br>Date:04/07/2019<br>Time:17:00<br>"], 
[[40.455404, -80.012292], [40.444653, -79.942723], "<b>Close Friend: Satvika</b><br>Start: Allegheny YMCA<br>End: Carnegie Mellon University<br>Date:04/07/2019<br>Time:17:00<br>"]];

//set other friends
var otherFriends = [
[[40.46747, -80.015503], [40.444495, -79.96058], "<b>Yolanda</b><br>Start: 2586 N Charles Street<br>End: University of Pittsburgh<br>Date:04/07/2019<br>Time:17:00<br>"], 
[[40.455241, -80.004615], [40.465315, -80.024813], "<b>Brianna</b><br>Start: King PreK-8<br>End: 2415 Brighton Road<br>Date:04/07/2019<br>Time:16:50<br>"], 
[[40.462207, -80.013329], [40.444923, -79.954149], "<b>Nadia</b><br>Start: Triangle Tech<br>End: Cathedral of Learning<br>Date:04/07/2019<br>Time:17:00<br>"]];

//add markers
function addMarkers(friendlist, close){
	if (close){
		var ic = friendIcon;
	} else{
		var ic = friendIcon2;
	}
	for (var i = 0; i < friendlist.length; i++){
		var marker = L.marker(friendlist[i][0], {icon: ic}).addTo(mymap);
		var markerend = L.marker(friendlist[i][1], {icon: destIcon}).addTo(mymap);
		var msg = friendlist[i][2] + calcDistance(startLoc[0], startLoc[1], friendlist[i][0][0], friendlist[i][0][1]) + " miles away.";
		marker.bindPopup(msg);
		markerend.bindPopup(msg);
	}
}

addMarkers(closeFriends, true);
addMarkers(otherFriends, false);

var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}
mymap.on('click', onMapClick);

function calcDistance(lat1, lon1, lat2, lon2){
	var R = 3958.755866; // metres
	var a1 = lat1 * (Math.PI/180);
	var a2 = lat2 * (Math.PI/180);
	var b1 = lon1 * (Math.PI/180);
	var b2 = lon2 * (Math.PI/180);
	var x = (b2-b1) * Math.cos((a1+a2)/2);
	var y = (a2-a1);
	var d = Math.sqrt(x*x + y*y) * R;
	return d.toFixed(3);
}
