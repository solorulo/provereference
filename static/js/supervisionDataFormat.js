function innerDataFormat (element, lastLetter, query, reg, usr) {
	var newElement;
	var searchRegion = function(array, userpk){
		for (var i = 0; i < array.length; i++) {
			for (var e = 0; e < array[i].users.length; e++) {
				if(array[i].users[e].pk == userpk){
					return i;
				}
			}
		}
		return 0;
	};
	var searchActivity = function(array, userpk){
		for (var i = 0; i < array.length; i++) {
			if(array[i].user_pk == userpk){
				return i;
			}
		};
		return 0;
	};

	var searchRegionBy = function(array, userpk, selectedIndex){
		selectedIndex --;
		for (var i = 0; i < array.length; i++) {
			if (i == selectedIndex) {
				for (var e = 0; e < array[i].users.length; e++) {
					if(array[i].users[e].pk == userpk){
						return false;
					}
				};
			}
		};
		return true;
	}

	newElement = document.createElement("div");
	newElement.setAttribute("id", "iabc");
	element.parentNode.replaceChild(newElement, element);

	for (var i = 0; i < data.users.length; i++) {
		var nombre, proveedor, fecha, sitio, telefono, id, contenedor;
		id = data.users[i].pk;
		nombre = data.users[i].first_name + " " + data.users[i].last_name;
		proveedor = data.provider[searchRegion(data.provider, id)].name;
		if (data.activity.length > 0) {
			sitio = data.activity[searchActivity(data.activity, id)].site;
			fecha = new Date(data.activity[searchActivity(data.activity, id)].date.replace(/ /, "T"));
		} else {
			sitio = ""
			fecha = null
		}
		telefono = data.users[i].telefono;

		var fecha_inicial = new Date(document.querySelector("#fecha_inicial").value);
		var fecha_final = new Date(document.querySelector("#fecha_final").value);
		if (!((Date.now()-5*60*1000 < (fecha != null)? fecha.getTime() : Date.now()) && document.querySelector("#checkActivos").checked)) continue;
		if (!(Date.now()-5*60*1000 < (fecha != null)? fecha.getTime() : Date.now()) && document.querySelector("#checkInactivos").checked) continue;
		if (fecha == null) fecha = new Date();
		if (fecha.getTime() < fecha_inicial.getTime()) continue;
		if (fecha.getTime() > fecha_final.getTime()+24*60*60*1000) continue;
		if (document.querySelector("#optionRegion").selectedIndex != 0 &&
			searchRegionBy(data.region, id, document.querySelector("#optionRegion").selectedIndex)) continue;
		if (document.querySelector("#optionSite").selectedIndex != 0 &&
			searchRegionBy(data.site, id, document.querySelector("#optionSite").selectedIndex)) continue;
		if (document.querySelector("#optionProveedor").selectedIndex != 0 &&
			searchRegionBy(data.provider, id, document.querySelector("#optionProveedor").selectedIndex)) continue;
		// Query
		if (query != '' && !(
			reg.test((data.users[i].first_name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].last_name).toLowerCase().replace(/[\s-]/g, '')) || 
			reg.test((data.users[i].imei).toLowerCase().replace(/[\s-]/g, '')) ||
			reg.test((data.users[i].telefono).toLowerCase().replace(/[\s-]/g, '')) ||
			reg.test((data.users[i].email).toLowerCase().replace(/[\s-]/g, ''))
			)) {
			continue;
		}
		// Dividiendo en cajas por letra
		if (lastLetter != data.users[i].first_name[0].toUpperCase()){
			lastLetter = data.users[i].first_name[0].toUpperCase();
			var letra = document.createElement("div");
			letra.setAttribute("class", "abc");
			var letraText = document.createTextNode(lastLetter);
			letra.appendChild(letraText);
			document.querySelector("#iabc").appendChild(letra);
			contenedor = document.createElement("table");
			letra.appendChild(contenedor);
		}
		// Render html
		var tr1 = document.createElement("tr");
		var tr2 = document.createElement("tr");
		var tdNombre = document.createElement("td");
		var aNombre = document.createElement("a");
		var txtNombre = document.createTextNode(nombre);
		var tdActivo = document.createElement("td");
		var tdProvedor = document.createElement("td");
		var txtProveedor = document.createTextNode("Proveedor:"+proveedor);
		var tdRegistro = document.createElement("td");
		var txtFechaRegistro = document.createTextNode("Último Registro:"+fechaToString((fecha != null)? fecha.toISOString() : null));
		var tdValorRegistro = document.createElement("td");
		var txtSitioRegistro = document.createTextNode(sitio);
		var tdTelefono = document.createElement("td");
		var txtTelefono = document.createTextNode("Teléfono:"+telefono);
		tdNombre.setAttribute("class", "t1");
		aNombre.setAttribute("href", "/proveedor/"+id);
		tdActivo.setAttribute("class", "t1");
		if(data.users[i].is_active)
			tdActivo.setAttribute("id", "tactivo");
		tdProvedor.setAttribute("class", "t2");
		tdRegistro.setAttribute("class", "t3");
		tdValorRegistro.setAttribute("class", "t3");
		tdTelefono.setAttribute("class", "t4");
		tr1.appendChild(tdNombre);
		tdNombre.appendChild(aNombre);
		aNombre.appendChild(txtNombre);
		tr1.appendChild(tdActivo);
		tr1.appendChild(tdProvedor);
		tdProvedor.appendChild(txtProveedor);
		tr2.appendChild(tdRegistro);
		tdRegistro.appendChild(txtFechaRegistro);
		tr2.appendChild(tdValorRegistro);
		tdValorRegistro.appendChild(txtSitioRegistro);
		tr2.appendChild(tdTelefono);
		tdTelefono.appendChild(txtTelefono);
		//Añadir a contenedor
		contenedor.appendChild(tr1);
		contenedor.appendChild(tr2);
	};
};

$(document).ready(function(event){
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
		option.setAttribute("class", "optionSite");
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
		var oldOptions = document.querySelectorAll(".optionSite");
		for (var i = oldOptions.length - 1; i >= 0; i--) {
			var clone = option.cloneNode(true);
			if(oldOptions[i].hasAttribute("id")){
				clone.setAttribute("id", "optionSite");
			}
			oldOptions[i].parentNode.replaceChild(clone, oldOptions[i]);
		};
	})();

	// ##################
	// Proveedor Select Option
	(function(optionName, data){
		var option = document.createElement("select");
		option.setAttribute("class", optionName);
		option.setAttribute("style", "display:block;");

		var firstOption = document.createElement("option");
		firstOption.appendChild(document.createTextNode(" ---- "));
		option.appendChild(firstOption);
		for (var i = 0; i < data.length; i++) {
			var optionText = data[i].name;
			var optionTextNode = document.createTextNode(optionText);
			var optionNode = document.createElement("option");
			optionNode.appendChild(optionTextNode);
			option.appendChild(optionNode);
		};
		var oldOptions = document.querySelectorAll("."+ optionName);
		for (var i = oldOptions.length - 1; i >= 0; i--) {
			var clone = option.cloneNode(true);
			if(oldOptions[i].hasAttribute("id")){
				clone.setAttribute("id", optionName);
			}
			oldOptions[i].parentNode.replaceChild(clone, oldOptions[i]);
		};
	})("optionProveedor", data.provider);

	var formatHandler = function(event) {
		dataFormat(document.querySelector("#busqueda input").value);
	};
	document.querySelector("#optionRegion").onchange =
	document.querySelector("#optionSite").onchange = 
	document.querySelector("#fecha_inicial").onchange =
	document.querySelector("#fecha_final").onchange = 
	document.querySelector("#optionProveedor").onchange =
	document.querySelector("#checkInactivos").onchange =
	document.querySelector("#checkActivos").onchange =
	formatHandler;
	// Pone datepicker para las fechas.
	$("#fecha_inicial, #fecha_final").datepicker({
		onSelect:function(dateText){
			formatHandler();
		},
		dateFormat: "yy-mm-dd"
	});
});