var map;
var coords = new Object();
var markersArray = [];
coords.lat = 44.856051;
coords.lng = -93.242539;

$(document).ready(function() 
{
	$( "#map_container" ).dialog({
		autoOpen:false,
		width: 555,
		height: 400,
		resizeStop: function(event, ui) {google.maps.event.trigger(map, 'resize')  },
		open: function(event, ui) {google.maps.event.trigger(map, 'resize'); }      
	});
	$(  "input:submit,input:button, a, button", "#controls" ).button();
});

function plotPoint(srcLat,srcLon,title,popUpContent,markerIcon)
{
	var myLatlng = new google.maps.LatLng(srcLat, srcLon);            
	var marker = new google.maps.Marker({
		position: myLatlng, 
		map: map, 
		title:title,
		icon: markerIcon
	});
	markersArray.push(marker);
	var infowindow = new google.maps.InfoWindow({
		content: popUpContent
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});                                          
}
function initialize() 
{      
	var latlng = new google.maps.LatLng(coords.lat, coords.lng);
	var myOptions = {
		zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),  myOptions);                         
}        