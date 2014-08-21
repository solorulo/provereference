function innerDataFormat (element, lastLetter, query, reg, usr) {
	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	for (var i = 0; i < data.length; i++) {
		if (!data[i].name){
			data[i].name = data[i].first_name + " " + data[i].last_name;
		}
		if (query != '' && !(
			reg.test((data[i].email).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data[i].name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data[i].tel).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}

		if (lastLetter != data[i].name[0].toUpperCase()){
			lastLetter = data[i].name[0].toUpperCase();
			// <div class="abc">A</div>
			var letra = document.createElement("div");
			letra.setAttribute("class", "abc");
			var letraText = document.createTextNode(lastLetter);
			letra.appendChild(letraText);
			document.querySelector("#iabc").appendChild(letra);
		}

		var contenedor = document.createElement("div");
		var nombre = document.createElement("div");
		var info = document.createElement("div");
		
		var nombreTextNode = document.createTextNode(data[i].name);
		var infoEmail = data[i].email;
		var infoTelefono = data[i].tel;
		var infoEmailNode = document.createTextNode(infoEmail);
		var infoTelefonoNode = document.createTextNode(infoTelefono);
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", data[i].id);
		nombre.setAttribute("class", "nombre");
		info.setAttribute("class", "info");

		nombre.appendChild(nombreTextNode);

		if (self_id == data[i].id) {
			var conf = document.createElement("div");
			var img = document.createElement("img");
			var confTextNode = document.createTextNode("Editar datos");
			conf.setAttribute("class", "conf");
			conf.onclick = (new admin(i, data[i].id)).open;
			img.setAttribute("src", "/static/imagenes/Supervisar/configurar.png");
			conf.appendChild(confTextNode);
			conf.appendChild(img);
			nombre.appendChild(conf);
		}
		info.appendChild(infoEmailNode);
		info.appendChild(document.createElement("br"));
		info.appendChild(infoTelefonoNode);
		contenedor.appendChild(nombre);
		contenedor.appendChild(info);
		document.querySelector("#iabc").appendChild(contenedor);
	};
};
