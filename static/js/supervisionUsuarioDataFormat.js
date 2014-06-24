function innerDataFormat (element, lastLetter, query, reg, usr) {
	var clone = document.querySelector("#actividadTemplate").cloneNode(true);
	clone.setAttribute("id", "actividad");
	clone.setAttribute("style", "");
	var actividadNode = document.querySelector("#actividad");
	actividadNode.parentNode.replaceChild(clone, actividadNode);

	function td(text){
		var td = document.createElement("td");
		var tdText = document.createTextNode(text);
		td.appendChild(tdText);
		return td;
	}
	var fecha_inicial = new Date(document.querySelector("#fecha_inicial").value);
	var fecha_final = new Date(document.querySelector("#fecha_final").value);

	for (var i = 0; i < data.activity.length; i++) {
		if((new Date(data.activity[i].fecha.replace(/ /, "T"))).getTime() < fecha_inicial.getTime()){
			continue;
		}
		if((new Date(data.activity[i].fecha.replace(/ /, "T"))).getTime() > fecha_final.getTime()+24*60*60*1000){
			continue;
		}
		var siteSelected = data.sites[document.querySelector("#select_sitios").selectedIndex - 1];
		if(siteSelected){
			if(siteSelected.nombre != data.activity[i].sitio__nombre){
				continue;
			}
		}

		var tr = document.createElement("tr");
		var tdTipo = td(data.activity[i].tipo_evento);
		var tdMargen = td(data.activity[i].margen_error);
		var tdLat = td(data.activity[i].lat);
		var tdLng = td(data.activity[i].lng);
		var tdFecha = td(fechaToString(data.activity[i].fecha));
		var tdSitio = td(data.activity[i].sitio__nombre);
		var tdMapa = td("Mapa");
		tdMapa.setAttribute("id", "showMap");
		tdMapa.setAttribute("name", "showMap");
		var mapaFunct = function(lat, lng, name, fecha){
			this.mapa = function(){
				initialize();
				$( "#map_container" ).dialog( "open" );
				map.setCenter(new google.maps.LatLng(lat, lng));
				map.setZoom(16);
				plotPoint(lat,lng,name,'<span class="gBubble"><b>'+fecha+'</b></span>');
				return false;
			};
		}
		var mapa = (new mapaFunct(data.activity[i].lat, data.activity[i].lng, data.activity[i].sitio__nombre, fechaToString(data.activity[i].fecha))).mapa;
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
	var createTd = function(texto){
		var td = document.createElement("td");
		var textNode = document.createTextNode(texto);
		td.appendChild(textNode);
		return td;
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

	// Relleno de datos de usuario.
	remplazarTexto("#usuario #t1 td", data.first_name + " " + data.last_name);

	var ultimotd = createTd("Último Registro:");
	if(!data.last_act){
		data.last_act = {};
		data.last_act.site = "";
		data.last_act.date = null;
	}
	var sitetd = createTd("Sitio: "+data.last_act.site);
	var fechatd = createTd("Fecha: "+(fechaToString(data.last_act.date)));
	remplazarTexto("#usuario #t2", "");
	document.querySelector("#usuario #t2").appendChild(ultimotd);
	document.querySelector("#usuario #t2").appendChild(sitetd);
	document.querySelector("#usuario #t2").appendChild(fechatd);

	remplazarTexto("#usuario #t3 td.usuariodatos", data.provider);
	remplazarTexto("#usuario #t4 td.usuariodatos", data.phone);

	// Pone datepicker para las fechas.
	$("#fecha_inicial, #fecha_final").datepicker({
		onSelect:function(dateText){
			dataFormat('');
		},
		dateFormat: "yy-mm-dd"
	});

	// Llena el filtro de sitios.
	var parentNode = document.querySelector("#select_sitios");
	var childs = parentNode.childNodes;
	for (var i = childs.length - 1; i >= 0; i--) {
		parentNode.removeChild(childs[i]);
	};
	var firstOption = document.createElement("option");
	firstOption.setAttribute("selected", true);
	firstOption.appendChild(document.createTextNode(" ---- "));
	parentNode.appendChild(firstOption);
	for (var i = 0; i < data.sites.length; i++) {
		var option = document.createElement("option");
		option.appendChild(document.createTextNode(data.sites[i].nombre));
		parentNode.appendChild(option);
	};

	// Trigger de filtros.

	document.querySelector("#select_sitios").onchange = function(){dataFormat('')};
	document.querySelector("#fecha_inicial").onkeydown = function(){dataFormat('')};
});