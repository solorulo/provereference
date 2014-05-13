function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#iabc").parentNode.replaceChild(emptyNode, element);

	for (var i = 0; i < data.users.length; i++) {
		// Creando el campo nombre, si no lo tienen
		if (!data.users[i].name){
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

		if(document.querySelector("#optionSitio").selectedIndex != 0){
			var s = data.sites[document.querySelector("#optionSitio").selectedIndex-1];
			var result = false;
			for (var e = 0; e < s.user_ids.length; e++) {
				if (s.user_ids[e].pk == data.users[i].id){
					result = true;
				}
			};
			if(!result){
				continue;
			}
		}

		if (lastLetter != data.users[i].name[0].toUpperCase()){
			lastLetter = data.users[i].name[0].toUpperCase();
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

	function newTd(text){
		var textNode = document.createTextNode(text);
		var doomNode = document.createElement("td");
		doomNode.appendChild(textNode);
		return doomNode;
	}
	var nombre = newTd(data.provider.name_provider);
	var region = newTd("Región " + data.provider.name_region);
	var nusers = newTd(data.provider.n_users + " Usuarios");
	nombre.setAttribute("colspan", 3);
	nusers.setAttribute("colspan", 2);
	nusers.setAttribute("class", "usuariodatos");
	region.setAttribute("colspan", 2);
	region.setAttribute("class", "usuariodatos");

	var doom = document.querySelector("#usuario #t1 td");
	doom.parentNode.replaceChild(nombre, doom);

	doom = document.querySelector("#usuario #t3 .usuariodatos");
	doom.parentNode.replaceChild(nusers, doom);

	doom = document.querySelector("#usuario #t4 .usuariodatos");
	doom.parentNode.replaceChild(region, doom);
};

$(document).ready(function(event){

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
		var optionText = data.sites[i].name_site;
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