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
			reg.test((data.sites[i].neumonico).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((getReg(data.sites[i].reg).nombre).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}

		if(document.querySelector("#optionRegion").selectedIndex != 0){
			var r = data.regiones[document.querySelector("#optionRegion").selectedIndex-1];
			var result = false;
			for (var n = 0; n < r.sites.length; n++) {
				if(r.sites[n].pk == data.sites[i].pk){
					result = true;
				}
			};
			if(!result){
				continue;
			}
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
	document.querySelector("#b_create").onclick = (new sitio()).create;

	/*
		SELECT OPTION REGIONES
	*/

	var optionRegion = document.createElement("select");
	optionRegion.setAttribute("class", "optionRegion");
	var firstOption = document.createElement("option");
	firstOption.appendChild(document.createTextNode(" ---- "));
	optionRegion.appendChild(firstOption);
	for (var i = 0; i < data.regiones.length; i++) {
		var optionText = data.regiones[i].nombre;
		var optionTextNode = document.createTextNode(optionText);
		var option = document.createElement("option");
		option.appendChild(optionTextNode);
		optionRegion.appendChild(option);
	};
	var oldOptionsRegion = document.querySelectorAll(".optionRegion");
	for (var i = oldOptionsRegion.length - 1; i >= 0; i--) {
		var clone = optionRegion.cloneNode(true);
		if(oldOptionsRegion[i].hasAttribute("id")){
			clone.setAttribute("id", "optionRegion");
		}
		oldOptionsRegion[i].parentNode.replaceChild(clone, oldOptionsRegion[i]);
	};
	document.querySelector("#optionRegion").onchange = function(event){dataFormat(inputDOM.value);};

	var openMap = function (){
		var myLatlng = map.getCenter();
		$( "#map_container" ).dialog( "open" );
		map.setCenter(myLatlng);
		var marker = new google.maps.Marker({
			position: myLatlng, 
			map: map,
			draggable: true
		});
		var infowindow = new google.maps.InfoWindow({
			content: ":)"
		});
		var openInfo = function(){
			var myLatlng = marker.getPosition();
			marker.setTitle(myLatlng.lat()+", "+myLatlng.lng());
			infowindow.setContent('<span class="gBubble"><b>'+marker.getTitle()+'</b></span>');
			infowindow.open(map, marker);
			$(".lat").val(myLatlng.lat())
			$(".lng").val(myLatlng.lng())
		};
		google.maps.event.addListener(marker, 'dragend', openInfo);
		google.maps.event.addListener(map, 'dblclick', function(e){
			e.stop();
			marker.setPosition(e.latLng);
			openInfo();
			return false;
		});
		markersArray.push(marker);
		openInfo();
	}
	/*
		MAPA
	*/
	$("#popup4 .btnMap").click(function() {
		var lat_ = document.querySelector("#popup4 .lat").value;
		var lng_ = document.querySelector("#popup4 .lng").value;
		initialize(lat_, lng_);
		openMap();
	});
	$("#popup3 .btnMap").click(function() {
		var lat_ = document.querySelector("#popup3 .lat").value;
		var lng_ = document.querySelector("#popup3 .lng").value;
		initialize(lat_, lng_);
		openMap();
	});
});