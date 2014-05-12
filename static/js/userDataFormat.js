function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	for (var i = 0; i < data.users.length; i++) {
		if (data.users[i].name == null){
			data.users[i].name = data.users[i].first_name + " " + data.users[i].last_name;
		}
		if (query != '' && !(
			reg.test((data.users[i].name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].imei).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].telefono).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].email).toLowerCase().replace(/[\s-]/g, ''))
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

		if (lastLetter != data.users[i].name[0].toUpperCase()){
			lastLetter = data.users[i].name[0].toUpperCase();
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
		
		var nombreTextNode = document.createTextNode(data.users[i].name);
		var infoEmail = data.users[i].email;
		var infoTelefono = data.users[i].telefono;
		var infoEmailNode = document.createTextNode(infoEmail);
		var infoTelefonoNode = document.createTextNode(infoTelefono);
		var confTextNode = document.createTextNode("Editar datos");
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", data.users[i].id);
		nombre.setAttribute("class", "nombre");
		conf.setAttribute("class", "conf");
		conf.onclick = (new user(i, data.users[i].id)).open;
		img.setAttribute("src", "/static/imagenes/Supervisar/configurar.png");
		info.setAttribute("class", "info");

		conf.appendChild(confTextNode);
		conf.appendChild(img);
		nombre.appendChild(nombreTextNode);
		nombre.appendChild(conf);
		info.appendChild(infoEmailNode);
		info.appendChild(document.createElement("br"));
		info.appendChild(infoTelefonoNode);
		contenedor.appendChild(nombre);
		contenedor.appendChild(info);
		document.querySelector("#iabc").appendChild(contenedor);
	};
};

$(document).ready(function(event){
	document.querySelector("#b_create").onclick = (new user()).create;

	/*
		SELECT OPTION REGIONES
	*/

	var optionRegion = document.createElement("select");
	optionRegion.setAttribute("class", "optionRegion");
	optionRegion.setAttribute("style", "display:block;");

	var firstOption = document.createElement("option");
	firstOption.appendChild(document.createTextNode("---"));
	optionRegion.appendChild(firstOption);
	for (var i = 0; i < data.regiones.length; i++) {
		var optionText = data.regiones[i].name;
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
	firstOption.appendChild(document.createTextNode("---"));
	optionSitio.appendChild(firstOption);
	for (var i = 0; i < data.sites.length; i++) {
		var optionText = data.sites[i].nombre;
		var optionTextNode = document.createTextNode(optionText);
		var option = document.createElement("option");
		option.appendChild(optionTextNode);
		optionSitio.appendChild(option);
	};
	var oldOptionSitio = document.querySelector(".optionSitio");
	oldOptionSitio.parentNode.replaceChild(optionSitio, oldOptionSitio);
	document.querySelector("#optionSitio").onchange = function(event){dataFormat(inputDOM.value);};

	/*
		SELECT OPTION PROVEEDOR
	*/

	var optionProvider = document.createElement("selectProvider");
	optionProvider.setAttribute("style", "display:block;");

	firstOption = document.createElement("option");
	firstOption.appendChild(document.createTextNode("---"));
	optionProvider.appendChild(firstOption);
	for (var i = 0; i < data.providers.length; i++) {
		var optionText = data.providers[i].nombre;
		var optionTextNode = document.createTextNode(optionText);
		var option = document.createElement("option");
		option.appendChild(optionTextNode);
		optionProvider.appendChild(option);
	};
	var oldOptionsProvider = document.querySelectorAll(".optionSitio");
	for (var i = oldOptionsProvider.length - 1; i >= 0; i--) {
		var clone = optionProvider.cloneNode(true);
		oldOptionsProvider[i].parentNode.replaceChild(clone, oldOptionsProvider[i]);
	};
});