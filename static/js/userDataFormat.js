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
		conf.onclick = (new usuario(i, data.users[i].pk)).open;
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
	document.querySelector("#b_create").onclick = (new usuario()).create;

	/*
		REPARAR LOS ESTILOS DENTRO DEL POPUP
	*/

	$("#popcontenido select").addClass("textinfo");
});