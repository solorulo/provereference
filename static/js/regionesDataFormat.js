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

	for (var i = 0; i < data.regiones.length; i++) {
		if (query != '' && !(
			reg.test((data.regiones[i].nombre).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.regiones[i].telefono).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}

		if (lastLetter != data.regiones[i].nombre[0].toUpperCase()){
			lastLetter = data.regiones[i].nombre[0].toUpperCase();
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

		var nombreTextNode = document.createTextNode(data.regiones[i].nombre);
		var phoneTextNode = document.createTextNode("Telefono: "+data.regiones[i].telefono);
		var confTextNode = document.createTextNode("Editar datos");
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", data.regiones[i].id);
		nombre.setAttribute("class", "nombre");
		conf.setAttribute("class", "conf");
		conf.onclick = (new region(i, data.regiones[i].id)).open;
		img.setAttribute("src", "/static/imagenes/Supervisar/configurar.png");
		info.setAttribute("class", "info");

		conf.appendChild(confTextNode);
		conf.appendChild(img);
		nombre.appendChild(nombreTextNode);
		nombre.appendChild(conf);
		info.appendChild(phoneTextNode);
		contenedor.appendChild(nombre);
		contenedor.appendChild(info);
		document.querySelector("#iabc").appendChild(contenedor);
	};
};

$(document).ready(function(event){
	document.querySelector("#b_create").onclick = (new region()).create;
});