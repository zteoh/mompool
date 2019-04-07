var childLoc = [40.461814, -80.010619];
var destLoc = [40.48074, -80.034958];
var mymap = L.map('urgentmap').setView(childLoc, 13);

//tile
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnJhbmRvbnBlayIsImEiOiJjanU3NTlmaG4xcXJnNDRwZHR0MWt5MmxuIn0.z24ELyhNLomU5c6yVWTCRg', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox.streets',
accessToken: 'pk.eyJ1IjoiYnJhbmRvbnBlayIsImEiOiJjanU3NTlmaG4xcXJnNDRwZHR0MWt5MmxuIn0.z24ELyhNLomU5c6yVWTCRg'
}).addTo(mymap);

//set icons
var childIcon = L.icon({
    iconUrl: 'child.png',

    iconSize:     [40, 45], // size of the icon
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

//add childLoc and destLoc
var circle = L.circle(childLoc, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.2,
    radius: 2000
}).addTo(mymap);
circle.bindPopup("<b>Nearby Friends Available</b><br>Showing friends in a 1 mile radius");
var child = L.marker(childLoc, {icon: childIcon}).addTo(mymap);
child.bindPopup("<b>Kids Location</b><br>Clayton Elementary School").openPopup();
var destination = L.marker(destLoc).addTo(mymap);
destination.bindPopup("<b>Destination</b><br>3555 Shadeland Avenue");

//set close friends
var closeFriends = [[[40.461675, -80.027668], "Close Friend: Clement"] , [[40.475518, -80.037189], "Close Friend: Zoe"], [[40.446261, -79.976431], "Close Friend: Brandon"], [[40.442865, -80.06774], "Close Friend: Abbey"], [[40.433322, -80.003778], "Close Friend: Satvika"]];

//set other friends
var otherFriends = [[[40.457234, -79.994281], "Yolanda"] , [[40.469827, -80.002862], "Brianna"], [[40.473591, -80.011384], "mongoDB"], [[40.470271, -79.995392], "Nadia"], [[40.452172, -80.025458], "Lily"]];

//add markers
function addMarkers(friendlist, close){
	if (close){
		var ic = friendIcon;
	} else{
		var ic = friendIcon2;
	}
	console.log('checkpoint1');
	console.log(friendlist.length);
	for (var i = 0; i < friendlist.length; i++){
		var marker = L.marker(friendlist[i][0], {icon: ic}).addTo(mymap);
		console.log('checkpoint2');
		var msg = "<b>" + friendlist[i][1] + "</b><br>"+ calcDistance(childLoc[0], childLoc[1], friendlist[i][0][0], friendlist[i][0][1]) + " miles away.";
		marker.bindPopup(msg);
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
