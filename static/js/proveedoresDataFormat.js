function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	for (var i = 0; i < data.providers.length; i++) {
		if (query != '' && !(
			reg.test((data.providers[i].name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.providers[i].reg).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}

		if(document.querySelector("#optionRegion").selectedIndex != 0){
			var r = data.regiones[document.querySelector("#optionRegion").selectedIndex-1];
			if("Región "+r.nombre != data.providers[i].reg){
				continue;
			}
		}
		if(document.querySelector("#optionSitio").selectedIndex != 0){
			var s = data.sites[document.querySelector("#optionSitio").selectedIndex-1];
			var result = false;
			for (var e = 0; e < s.provs.length; e++) {
				if (s.provs[e].pk == data.providers[i].id){
					result = true;
				}
			};
			if(!result){
				continue;
			}
		}

		if (lastLetter != data.providers[i].name[0].toUpperCase()){
			lastLetter = data.providers[i].name[0].toUpperCase();
			var letra = document.createElement("div");
			letra.setAttribute("class", "abc");
			var letraText = document.createTextNode(lastLetter);
			letra.appendChild(letraText);
			document.querySelector("#iabc").appendChild(letra);
		}

		var contenedor = document.createElement("div");
		var nombre = document.createElement("div");
		var info = document.createElement("div");
		
		var nombreTxtNode = document.createTextNode(data.providers[i].name);
		if (data.providers[i].nusers == 1){
			nusersSuffix = " Usuario";
		} else {
			nusersSuffix = " Usuarios";
		}
		var usuartiosTxtNode = document.createTextNode(data.providers[i].nusers + nusersSuffix);
		var regionTxtNode = document.createTextNode(data.providers[i].reg);
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", data.providers[i].id);
		nombre.setAttribute("class", "nombre");
		// TODO Link a los detalles
		nombre.onclick = (new proveedor(i, data.providers[i].id)).open;
		info.setAttribute("class", "info");

		nombre.appendChild(nombreTxtNode);
		info.appendChild(usuartiosTxtNode);
		info.appendChild(document.createElement("br"));
		info.appendChild(regionTxtNode);
		contenedor.appendChild(nombre);
		contenedor.appendChild(info);
		document.querySelector("#iabc").appendChild(contenedor);
	};
};

$(document).ready(function(event){
	document.querySelector("#b_create").onclick = (new proveedor()).create;

	/*
		SELECT OPTION REGIONES
	*/

	var optionRegion = document.createElement("select");
	optionRegion.setAttribute("class", "optionRegion");
	optionRegion.setAttribute("style", "display:block;");

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

	/*
		SELECT OPTION SITIOS
	*/

	var optionSitio = document.createElement("select");
	optionSitio.setAttribute("id", "optionSitio");
	optionSitio.setAttribute("style", "display:block;");

	firstOption = document.createElement("option");
	firstOption.appendChild(document.createTextNode(" ---- "));
	optionSitio.appendChild(firstOption);
	for (var i = 0; i < data.sites.length; i++) {
		var optionText = data.sites[i].name;
		var optionTextNode = document.createTextNode(optionText);
		var option = document.createElement("option");
		option.appendChild(optionTextNode);
		optionSitio.appendChild(option);
	};
	var oldOptionSitio = document.querySelector(".optionSitio");
	oldOptionSitio.parentNode.replaceChild(optionSitio, oldOptionSitio);
	document.querySelector("#optionSitio").onchange = function(event){dataFormat(inputDOM.value);};

	/*
		FUNCIÓN SOBRESCRITA PARA REORDENAR
	*/

	dataSort = function(){
		data.providers.sort(function(a, b){
			if (a.name < b.name){
				return -1;
			}
			if (a.name > b.name){
				return 1;
			}
			return 0;
		});
	};
});