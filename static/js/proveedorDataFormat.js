
var searchRegion = function(array, userpk){
	for (var i = 0; i < array.length; i++) {
		for (var e = 0; e < array[i].users.length; e++) {
			if(array[i].users[e].pk == userpk){
				return i;
			}
		};
	};
	return -1;
}

function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	for (var i = 0; i < data.users.length; i++) {

		var id = data.users[i].pk;
		if (data.users[i].name == null){
			data.users[i].name = data.users[i].first_name + " " + data.users[i].last_name;
		}
		if (query != '' && !(
			reg.test((data.users[i].name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].telefono).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].email).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}

		if (document.querySelector("#optionRegion").selectedIndex != 0 &&
			document.querySelector("#optionRegion").selectedIndex != searchRegion(data.region, id)+1) continue;
		if (document.querySelector("#optionSitio").selectedIndex != 0 &&
			document.querySelector("#optionSitio").selectedIndex != searchRegion(data.site, id)+1) continue;

		if (query != '' && !(
			reg.test((data.users[i].first_name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].last_name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].imei).toLowerCase().replace(/[\s-]/g, '')) ||
			reg.test((data.users[i].telefono).toLowerCase().replace(/[\s-]/g, '')) ||
			reg.test((data.users[i].email).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
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
		conf.onclick = (new proveedor(i, data.users[i].pk)).open;
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
	document.querySelector("#b_create").onclick = (new proveedor()).create;

	/*
		REPARAR LOS ESTILOS DENTRO DEL POPUP
	*/
	$("#popcontenido select").addClass("textinfo");

	// ####################
	// Región Select Option
	(function(){
		var option = document.createElement("select");
		option.setAttribute("class", "optionRegion");
		option.setAttribute("style", "display:block;");

		var firstOption = document.createElement("option");
		firstOption.appendChild(document.createTextNode(" ---- "));
		option.appendChild(firstOption);
		for (var i = 0; i < data.region.length; i++) {
			var optionText = data.region[i].name;
			var optionTextNode = document.createTextNode(optionText);
			var optionNode = document.createElement("option");
			optionNode.appendChild(optionTextNode);
			option.appendChild(optionNode);
		};
		var oldOptions = document.querySelectorAll(".optionRegion");
		for (var i = oldOptions.length - 1; i >= 0; i--) {
			var clone = option.cloneNode(true);
			if(oldOptions[i].hasAttribute("id")){
				clone.setAttribute("id", "optionRegion");
			}
			oldOptions[i].parentNode.replaceChild(clone, oldOptions[i]);
		};
	})();

	// ###################
	// Sitio Select Option
	(function(){
		var option = document.createElement("select");
		option.setAttribute("class", "optionSitio");
		option.setAttribute("style", "display:block;");

		var firstOption = document.createElement("option");
		firstOption.appendChild(document.createTextNode(" ---- "));
		option.appendChild(firstOption);
		for (var i = 0; i < data.site.length; i++) {
			var optionText = data.site[i].name;
			var optionTextNode = document.createTextNode(optionText);
			var optionNode = document.createElement("option");
			optionNode.appendChild(optionTextNode);
			option.appendChild(optionNode);
		};
		var oldOptions = document.querySelectorAll(".optionSitio");
		for (var i = oldOptions.length - 1; i >= 0; i--) {
			var clone = option.cloneNode(true);
			if(oldOptions[i].hasAttribute("id")){
				clone.setAttribute("id", "optionSitio");
			}
			oldOptions[i].parentNode.replaceChild(clone, oldOptions[i]);
		};
	})();

	// ###################
	// Compaine Select Option
	(function(){
		var option = document.createElement("select");
		option.setAttribute("class", "optionCompany");
		option.setAttribute("style", "display:block;");

		var firstOption = document.createElement("option");
		firstOption.appendChild(document.createTextNode(" ---- "));
		option.appendChild(firstOption);
		for (var i = 0; i < data.companies.length; i++) {
			var optionText = data.companies[i].name;
			var optionTextNode = document.createTextNode(optionText);
			var optionNode = document.createElement("option");
			optionNode.appendChild(optionTextNode);
			option.appendChild(optionNode);
		};
		var oldOptions = document.querySelectorAll(".optionCompany");
		for (var i = oldOptions.length - 1; i >= 0; i--) {
			var clone = option.cloneNode(true);
			if(oldOptions[i].hasAttribute("id")){
				clone.setAttribute("id", "optionCompany");
			}
			oldOptions[i].parentNode.replaceChild(clone, oldOptions[i]);
		};
	})();


	var formatHandler = function(event) {
		dataFormat(document.querySelector("#busqueda input").value);
	};
	document.querySelector("#optionRegion").onchange =
	document.querySelector("#optionSitio").onchange = 
	formatHandler;
});