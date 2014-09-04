function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	var getReg = function(id){
		for (var i = data.regiones.length - 1; i >= 0; i--) {
			if(data.regiones[i].pk == id)
				return data.regiones[i];
		};
	}

	for (var i = 0; i < data.sites.length; i++) {
		if (query != '' && !(
			reg.test((data.sites[i].name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.sites[i].phone).toLowerCase().replace(/[\s-]/g, '')) || 
			)) {
			continue;
		}

		if (lastLetter != data.sites[i].name[0].toUpperCase()){
			lastLetter = data.sites[i].name[0].toUpperCase();
			// <div class="abc">A</div>
			var letra = document.createElement("div");
			letra.setAttribute("class", "abc");
			var letraText = document.createTextNode(lastLetter);
			letra.appendChild(letraText);
			document.querySelector("#iabc").appendChild(letra);
		}

		var contenedor = document.createElement("div");
		var nombre = document.createElement("div");
		var conf = document.createElement("div");
		var img = document.createElement("img");
		var info = document.createElement("div");
		var mapa = document.createElement("button");
	
		var mapaFn = (function (lat, lng) {
					return function () {
						initialize(lat, lng);
						var myLatlng = map.getCenter();
						$( "#map_container" ).dialog( "open" );
						map.setCenter(myLatlng);
						var marker = new google.maps.Marker({
							position: myLatlng,
							map: map
						});
						var infowindow = new google.maps.InfoWindow({
							content: ":)"
						});
						marker.setTitle(myLatlng.lat()+", "+myLatlng.lng());
						infowindow.setContent('<span class="gBubble"><b>'+marker.getTitle()+'</b></span>');
						infowindow.open(map,marker);
						markersArray.push(marker);
					}
				})(data.sites[i].lat, data.sites[i].lng);

		var nombreTextNode = document.createTextNode(data.sites[i].name);
		var infoNeumonico = document.createTextNode("Neumonico: "+data.sites[i].neumonico);
		var infoLat = document.createTextNode("Lat: "+data.sites[i].lat);
		var infoLng = document.createTextNode("Lng: "+data.sites[i].lng);
		var infoReg = document.createTextNode("Región: "+getReg(data.sites[i].reg).nombre);
		var confTextNode = document.createTextNode("Editar datos");
		var mapaTextNode = document.createTextNode("Mapa");
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", data.sites[i].pk);
		nombre.setAttribute("class", "nombre");
		conf.setAttribute("class", "conf");
		conf.onclick = (new sitio(i, data.sites[i].pk)).open;
		img.setAttribute("src", "/static/imagenes/Supervisar/configurar.png");
		info.setAttribute("class", "info");
		mapa.setAttribute("class", "btnMapView");
		// info.setAttribute("class", "btnMapView");
		mapa.onclick = mapaFn;

		conf.appendChild(confTextNode);
		conf.appendChild(img);
		nombre.appendChild(nombreTextNode);
		nombre.appendChild(conf);
		info.appendChild(infoNeumonico);
		info.appendChild(document.createElement("br"));
		info.appendChild(infoLat);
		info.appendChild(document.createElement("br"));
		info.appendChild(infoLng);
		info.appendChild(document.createElement("br"));
		info.appendChild(infoReg);
		contenedor.appendChild(nombre);
		contenedor.appendChild(info);
		mapa.appendChild(mapaTextNode);
		contenedor.appendChild(mapa);
		document.querySelector("#iabc").appendChild(contenedor);
	};
};

$(document).ready(function(event){
	document.querySelector("#b_create").onclick = (new region()).create;


});