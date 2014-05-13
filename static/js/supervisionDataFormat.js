function innerDataFormat (element, lastLetter, query, reg, usr) {
	var clone = document.querySelector("#actividadTemplate").cloneNode(true);
	clone.setAttribute("id", "#actividad");
	clone.setAttribute("style", "");
	var actividadNode = document.querySelector("#actividad");
	actividadNode.parentNode.replaceChild(clone, actividadNode);

	function td(text){
		var td = document.createElement("td");
		var tdText = document.createTextNode(text);
		td.appendChild(tdText);
		return td;
	}
	for (var i = 0; i < data.activity.length; i++) {
		var tr = document.createElement("tr");
		var tdTipo = td(data.activity[i].tipo_evento);
		var tdMargen = td(data.activity[i].margen_error);
		var tdLat = td(data.activity[i].lat);
		var tdLng = td(data.activity[i].lng);
		var tdFecha = td(new Date(data.activity[i].fecha).toString());
		var tdSitio = td(data.activity[i].sitio__nombre);
		var tdMapa = td("Mapa");
		tdMapa.setAttribute("id", "showMap");
		tdMapa.setAttribute("name", "showMap");
		var mapaFunct = function(lat, lng, name, fecha){
			this.mapa = function(){
				initialize();
				$( "#map_container" ).dialog( "open" );
				map.setCenter(new google.maps.LatLng(lat, lng));
				map.setZoom(20);
				plotPoint(lat,lng,name,'<span class="gBubble"><b>'+(new Date(fecha)).toString()+'</b></span>');
				return false;
			};
		}
		var mapa = (new mapaFunct(data.activity[i].lat, data.activity[i].lng, data.activity[i].sitio__nombre, (new Date(data.activity[i].fecha)).toString())).mapa;
		tdMapa.onclick = mapa;
		tr.appendChild(tdTipo);
		tr.appendChild(tdMargen);
		tr.appendChild(tdLat);
		tr.appendChild(tdLng);
		tr.appendChild(tdFecha);
		tr.appendChild(tdSitio);
		tr.appendChild(tdMapa);

		clone.appendChild(tr);
	};
};

$(document).ready(function(){
	$("#actividadTemplate").hide();
	var remplazarTexto = function(query, texto){
		return remplazar(query, document.createTextNode(texto));
	}
	var remplazar = function(query, node){
		var parentNode = document.querySelector(query);
		var childs = parentNode.childNodes;
		for (var i = childs.length - 1; i >= 0; i--) {
			parentNode.removeChild(childs[i]);
		};
		parentNode.appendChild(node);
		return parentNode
	}
	remplazarTexto("#usuario #t1 td", data.first_name + " " + data.last_name);
	var ultimotd = document.createTextNode("Ultimo Registro");
	var td = document.createElement("td");

	// remplazarTexto("#usuario #t2 td.usuariodatos");
	remplazarTexto("#usuario #t3 td.usuariodatos", data.provider);
	remplazarTexto("#usuario #t4 td.usuariodatos", data.phone);
});