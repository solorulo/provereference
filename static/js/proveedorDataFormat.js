function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	for (var i = 0; i < all_data.providers.length; i++) {
		if (query != '' && !(
			reg.test((all_data.providers[i].name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((all_data.providers[i].reg).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}

		if(document.querySelector("#optionRegion").selectedIndex != 0){
			var r = all_data.regiones[document.querySelector("#optionRegion").selectedIndex-1];
			if("Región "+r.nombre != all_data.providers[i].reg){
				continue;
			}
		}
		if(document.querySelector("#optionSitio").selectedIndex != 0){
			var s = all_data.sites[document.querySelector("#optionSitio").selectedIndex-1];
			var result = false;
			for (var e = 0; e < s.provs.length; e++) {
				if (s.provs[e].pk == all_data.providers[i].id){
					result = true;
				}
			};
			if(!result){
				continue;
			}
		}

		if (lastLetter != all_data.providers[i].name[0].toUpperCase()){
			lastLetter = all_data.providers[i].name[0].toUpperCase();
			var letra = document.createElement("div");
			letra.setAttribute("class", "abc");
			var letraText = document.createTextNode(lastLetter);
			letra.appendChild(letraText);
			document.querySelector("#iabc").appendChild(letra);
		}

		var contenedor = document.createElement("div");
		var nombre = document.createElement("div");
		var info = document.createElement("div");
		
		var nombreTxtNode = document.createTextNode(all_data.providers[i].name);
		if (all_data.providers[i].nusers == 1){
			nusersSuffix = " Usuario";
		} else {
			nusersSuffix = " Usuarios";
		}
		var usuartiosTxtNode = document.createTextNode(all_data.providers[i].nusers + nusersSuffix);
		var regionTxtNode = document.createTextNode(all_data.providers[i].reg);
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", all_data.providers[i].id);
		nombre.setAttribute("class", "nombre");
		// TODO Link a los detalles
		nombre.onclick = (new proveedor(i, all_data.providers[i].id)).open;
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
	/*
		SELECT OPTION REGIONES
	*/
	var optionRegion = document.createElement("select");
	optionRegion.setAttribute("id", "optionRegion");
	optionRegion.setAttribute("style", "display:block;");

	var firstOption = document.createElement("option");
	firstOption.appendChild(document.createTextNode("---"));
	optionRegion.appendChild(firstOption);
	for (var i = 0; i < all_data.regiones.length; i++) {
		var optionText = all_data.regiones[i].nombre;
		var optionTextNode = document.createTextNode(optionText);
		var option = document.createElement("option");
		option.appendChild(optionTextNode);
		optionRegion.appendChild(option);
	};
	optionRegion.onchange = function(event){dataFormat(inputDOM.value);};
	var oldOptionRegion = document.querySelector("#optionRegion");
	oldOptionRegion.parentNode.replaceChild(optionRegion, oldOptionRegion);

	/*
		SELECT OPTION SITIOS
	*/
	var optionSitio = document.createElement("select");
	optionSitio.setAttribute("id", "optionSitio");
	optionSitio.setAttribute("style", "display:block;");

	firstOption = document.createElement("option");
	firstOption.appendChild(document.createTextNode("---"));
	optionSitio.appendChild(firstOption);
	for (var i = 0; i < all_data.sites.length; i++) {
		var optionText = all_data.sites[i].name;
		var optionTextNode = document.createTextNode(optionText);
		var option = document.createElement("option");
		option.appendChild(optionTextNode);
		optionSitio.appendChild(option);
	};
	optionSitio.onchange = function(event){dataFormat(inputDOM.value);};
	var oldOptionSitio = document.querySelector("#optionSitio");
	oldOptionSitio.parentNode.replaceChild(optionSitio, oldOptionSitio);
});