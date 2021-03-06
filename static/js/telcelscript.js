function confirm_action(event, action) {
	$("#dialogPass").dialog("option", "buttons", [{
		text: "Aceptar",
		click: function() {
			action(event);
			$(this).dialog("close");
		}
	}]);
	$('#dialogPass').dialog('open');
}
function abrirAdmin(i, id) {
	abrir("#popup1");
	document.querySelector("#popup1 .form_nombre").value = data[i].first_name;
	document.querySelector("#popup1 .form_apellido").value = data[i].last_name;
	document.querySelector("#popup1 .form_mail").value = data[i].email;
	document.querySelector("#popadministrador input").checked = data[i].is_active;
	var obj = new admin(i, id)
	// document.querySelector("#popup1 #beliminar").onclick = obj.delete;
	document.querySelector("#popup1 #beliminar").onclick = function(event) {
		confirm_action(event, obj.delete);
	};
	// document.querySelector("#popup1 #b_save").onclick = obj.save;
	document.querySelector("#popup1 #b_save").onclick = function(event) {
		confirm_action(event, obj.save);
	};
};

function abrirSupervisor(i, id) {
	abrir("#popup1");
	document.querySelector("#popup1 .form_nombre").value = data[i].first_name;
	document.querySelector("#popup1 .form_apellido").value = data[i].last_name;
	document.querySelector("#popup1 .form_mail").value = data[i].email;
	document.querySelector("#popadministrador input").checked = data[i].is_active;
	var obj = new supervisor(i, id)
	document.querySelector("#popup1 #beliminar").onclick = obj.delete;
	document.querySelector("#popup1 #b_save").onclick = obj.save;
}

function cerrar(selector) {
	if (!document.querySelector(selector)) {
		return;
	}
	document.querySelector(selector).style.webkitTransition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.webkitTransform = "scale(0)";
	document.querySelector(selector).style.msTransition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.msTransform = "scale(0)";
	document.querySelector(selector).style.transition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.transform = "scale(0)";
	// Formulario reset.
	var inputs = document.querySelectorAll(selector + " input[type=\"text\"]");
	for (var i = inputs.length - 1; i >= 0; i--) {
		inputs[i].value = '';
	};
	// TODO Limpiar los select
	var select = document.querySelectorAll(selector + " select");
	for (var i = select.length - 1; i >= 0; i--) {
		select[i].selectedIndex = 0;
	};
	if ((/^\/administradores/i).test(document.location.pathname)) {
		document.querySelector(selector + " input[type=\"checkbox\"]").checked = true;
	} else if ((/^\/supervisores/i).test(document.location.pathname)) {
		document.querySelector(selector + " input[type=\"checkbox\"]").checked = false;
	}
}

function abrir(selector) {
	document.querySelector(selector).style.webkitTransition = ".2s transform ease-in 0s";
	document.querySelector(selector).style.msTransform = "scale(1)";
	document.querySelector(selector).style.msTransition = ".2s transform ease-in 0s";
	document.querySelector(selector).style.webkitTransform = "scale(1)";
	document.querySelector(selector).style.transition = ".2s transform ease-in 0s";
	document.querySelector(selector).style.transform = "scale(1)";

};

function cerrar0() {
	cerrar("#popup1");

};

function abrir0() {
	abrir("#popup1");

};

function abrir1() {
	abrir("#popup2");

};

function cerrar1() {
	cerrar("#popup2");
};

function abrir2() {
	abrir("#popup3");

};

function cerrar2() {
	cerrar("#popup3");

};

function abrir3() {
	abrir("#popup4");

};

function cerrar3() {
	cerrar("#popup4");

};

function cerrarTodo() {
	cerrar0();
	cerrar1();
	cerrar2();
	cerrar3();
}

function activo() {
	document.querySelector("#popadministrador img").style.webkitTransform = "rotate(180deg)";
	document.querySelector("#popadministrador img").style.msTransform = "rotate(180deg)";
	document.querySelector("#popadministrador img").style.transform = "rotate(180deg)";

};

function subir() {
	window.location.href = "#inicio";
	window.location.href = "#inicio1";

};

function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}

	return cookieValue;
};

function Bridge(i, id, nombre, datos) {
	this.create = function(event) {
		event.preventDefault();
		var postdata = jQuery.extend({}, datos);
		postdata.csrfmiddlewaretoken = csrftoken;
		$.post("/" + nombre + "/new/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			// alert(code);
			if (code == 1) {
				$.getJSON("json", function(json) {
					data = json;
					dataFormat('');
				});
				cerrarTodo();
			} else {
				$("#dialogError").dialog("open");
			}
			return true;
		}).fail(function() {
			$("#dialogError").dialog("open");
		});
		return false;
	};
	this.save = function(event) {
		event.preventDefault();
		var postdata = jQuery.extend({}, datos);
		postdata.csrfmiddlewaretoken = csrftoken;
		$.post("/" + nombre + "/" + id + "/edit/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			// alert(response["code"]);
			if (code == '1' || code == '1.1') {
				$.getJSON("json", function(json) {
					data = json;
					dataFormat('');
				});
				cerrarTodo();
			} else {
				$("#dialogError").dialog("open");
			}
			return true;
		}).fail(function() {
			$("#dialogError").dialog("open");
		});
		return false;
	};
	this.delete = function() {
		event.preventDefault();
		var postdata = jQuery.extend({}, datos);
		postdata.csrfmiddlewaretoken = csrftoken;
		$.post("/" + nombre + "/" + id + "/delete/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			// alert(code);
			if (code == '1') {
				$.getJSON("json", function(json) {
					data = json;
					dataFormat('');
				});
				cerrarTodo();
			} else {
				$("#dialogError").dialog("open");
			}
			return true;
		}).fail(function() {
			$("#dialogError").dialog("open");
		});
		return false;
	};
};

function admin(i, id) {
	this.open = function() {
		abrirAdmin(i, id);
	};
	this.create = function(event) {
		var email = $('#email').val();
		var first_name = $('#first_name').val();
		var last_name = $('#last_name').val();
		var password = $('#password').val();
		var is_admin = document.querySelector("#popup2 input[type=checkbox]").checked;
		var myp = $('.myp').val();
		var postdata = {
			'email': email,
			'first_name': first_name,
			'last_name': last_name,
			'password': password,
			'is_admin': is_admin,
			'tel': '',
			'my_password': myp
		};
		(new Bridge(i, id, "administradores", postdata)).create(event);
	};
	this.save = function(event) {
		var email = $('#popup1 .form_mail').val();
		var first_name = $('#popup1 .form_nombre').val();
		var last_name = $('#popup1 .form_apellido').val();
		var password = $('#popup1 .form_password').val();
		var is_admin = document.querySelector("#popup1 input[type=checkbox]").checked;
		var myp = $('.myp').val();
		var postdata = {
			'email': email,
			'first_name': first_name,
			'last_name': last_name,
			'is_admin': is_admin,
			'password': password,
			'tel': '',
			'my_password': myp
		};
		(new Bridge(i, id, "administradores", postdata)).save(event);
	}
	this.delete = function() {
		var myp = $('.myp').val();
		var postdata = {
			'my_password': myp
		};
		(new Bridge(i, id, "administradores", postdata)).delete();
	}
};

function supervisor(i, id) {
	this.open = function() {
		abrirSupervisor(i, id);
	};
	this.create = function(event) {
		var first_name = $("#first_name").val();
		var last_name = $("#last_name").val();
		var email = $("#email").val();
		var contrasena = $("#contrasena").val();
		var is_admin = document.querySelector("#popup2 input[type=checkbox]").checked;
		var postdata = {
			'email': email,
			'first_name': first_name,
			'last_name': last_name,
			'password': contrasena,
			'is_admin': is_admin,
			'tel': ''
		};
		(new Bridge(i, id, "supervisores", postdata)).create(event);
	};
	this.save = function(event) {
		var email = $('#popup1 .form_mail').val();
		var first_name = $('#popup1 .form_nombre').val();
		var last_name = $('#popup1 .form_apellido').val();
		var contrasena = $("#popup1 .form_password").val();
		var is_admin = document.querySelector("#popup1 input[type=checkbox]").checked;
		var postdata = {
			'email': email,
			'first_name': first_name,
			'last_name': last_name,
			'is_admin': is_admin,
			'password': contrasena,
			'tel': ''
		};
		(new Bridge(i, id, "supervisores", postdata)).save(event);
	};
	this.delete = function() {
		(new Bridge(i, id, "supervisores")).delete();
	};
};

function proveedor(i, id) {
	this.open = function() {
		document.querySelector("#popup4 .textinfo.form_nombre").value = data.users[i].first_name;
		document.querySelector("#popup4 .textinfo.apellido").value = data.users[i].last_name;
		document.querySelector("#popup4 .textinfo.email").value = data.users[i].email;
		document.querySelector("#popup4 .textinfo.imei").value = data.users[i].imei;
		document.querySelector("#popup4 .textinfo.telefono").value = data.users[i].telefono;
		document.querySelector("#popup4 .optionCompany").selectedIndex = searchRegion(data.companies, id) + 1;
		document.querySelector("#popup4 .bazul").onclick = (new proveedor(i, id)).save;
		document.querySelector("#popup4 #beliminar").onclick = (new proveedor(i, id)).delete;
		abrir("#popup4");
	};
	this.create = function(event) {
		var nombreNode = document.querySelector("#popup3 .textinfo.form_nombre").value;
		var apellidoNode = document.querySelector("#popup3 .textinfo.apellido").value;
		var emailNode = document.querySelector("#popup3 .textinfo.email").value;
		var imeiNode = document.querySelector("#popup3 .textinfo.imei").value;
		var telefonoNode = document.querySelector("#popup3 .textinfo.telefono").value;
		var company = document.querySelector("#popup3 .optionCompany").selectedIndex;
		if (company == 0) {
			alert("Debe seleccionar una compañia primero.");
			return;
		}
		company = data.companies[company - 1].pk;
		var postdata = {
			'email': emailNode,
			'first_name': nombreNode,
			'last_name': apellidoNode,
			'imei': imeiNode,
			'phone': telefonoNode,
			'empresa': company
		};
		(new Bridge(i, id, "proveedores", postdata)).create(event);
	};
	this.save = function(event) {
		var nombreNode = document.querySelector("#popup4 .textinfo.form_nombre").value;
		var apellidoNode = document.querySelector("#popup4 .textinfo.apellido").value;
		var emailNode = document.querySelector("#popup4 .textinfo.email").value;
		var imeiNode = document.querySelector("#popup4 .textinfo.imei").value;
		var telefonoNode = document.querySelector("#popup4 .textinfo.telefono").value;	
		var company = document.querySelector("#popup4 .optionCompany").selectedIndex;
		if (company == 0) {
			alert("Debe seleccionar una compañia primero.");
			return;
		}
		company = data.companies[company - 1].pk;	
		var postdata = {
			'email': emailNode,
			'first_name': nombreNode,
			'last_name': apellidoNode,
			'imei': imeiNode,
			'phone': telefonoNode,
			'provider': company
		};
		(new Bridge(i, id, "proveedores", postdata)).save(event);
	};
	this.delete = function() {
		(new Bridge(i, id, "proveedores")).delete();
	};
};

function usuario(i, id) {
	this.open = function() {
		document.querySelector("#popup4 .textinfo.form_nombre").value = data.users[i].first_name;
		document.querySelector("#popup4 .textinfo.apellido").value = data.users[i].last_name;
		document.querySelector("#popup4 .textinfo.email").value = data.users[i].email;
		document.querySelector("#popup4 .textinfo.password").value = '';
		document.querySelector("#popup4 .textinfo.telefono").value = data.users[i].telefono;
		document.querySelector("#popup4 .bazul").onclick = (new usuario(i, id)).save;
		document.querySelector("#popup4 #beliminar").onclick = (new usuario(i, id)).delete;
		abrir("#popup4");
	};
	this.create = function(event) {
		var nombreNode = document.querySelector("#popup3 .textinfo.form_nombre").value;
		var apellidoNode = document.querySelector("#popup3 .textinfo.apellido").value;
		var emailNode = document.querySelector("#popup3 .textinfo.email").value;
		var passwordNode = document.querySelector("#popup3 .textinfo.password").value;
		var telefonoNode = document.querySelector("#popup3 .textinfo.telefono").value;
		var postdata = {
			'email': emailNode,
			'password': passwordNode,
			'first_name': nombreNode,
			'last_name': apellidoNode,
			'phone': telefonoNode
		};
		(new Bridge(i, id, "usuarios", postdata)).create(event);
	};
	this.save = function(event) {
		var nombreNode = document.querySelector("#popup4 .textinfo.form_nombre").value;
		var apellidoNode = document.querySelector("#popup4 .textinfo.apellido").value;
		var emailNode = document.querySelector("#popup4 .textinfo.email").value;
		var passwordNode = document.querySelector("#popup4 .textinfo.password").value
		var telefonoNode = document.querySelector("#popup4 .textinfo.telefono").value;		
		var postdata = {
			'email': emailNode,
			'password': passwordNode,
			'first_name': nombreNode,
			'last_name': apellidoNode,
			'phone': telefonoNode
		};
		(new Bridge(i, id, "usuarios", postdata)).save(event);
	};
	this.delete = function() {
		(new Bridge(i, id, "usuarios")).delete();
	};
};

function sitio(i, id) {
	var searchRegionIndexByID = function(id) {
		for (var i = 0; i < data.regiones.length; i++) {
			if (data.regiones[i].pk == id)
				return i;
		};
	};
	this.open = function() {

		document.querySelector("#popup4 .form_nombre").value = data.sites[i].name;
		document.querySelector("#popup4 .neumonico").value = data.sites[i].neumonico;
		document.querySelector("#popup4 .lat").value = data.sites[i].lat;
		document.querySelector("#popup4 .lng").value = data.sites[i].lng;
		document.querySelector("#popup4 .optionRegion").selectedIndex = searchRegionIndexByID(data.sites[i].reg) + 1;
		document.querySelector("#popup4 #b_save").onclick = (new sitio(i, id)).save;
		document.querySelector("#popup4 #beliminar").onclick = (new sitio(i, id)).delete
		abrir3();

	};
	this.create = function(event) {
		var name = document.querySelector("#popup3 .form_nombre").value;
		var neumonico = document.querySelector("#popup3 .neumonico").value;
		var lat = document.querySelector("#popup3 .lat").value;
		var lng = document.querySelector("#popup3 .lng").value;
		var reg = document.querySelector("#popup3 .optionRegion").selectedIndex;
		if (reg == 0) {
			alert("Debe seleccionar una región primero.");
			return;
		}
		reg = data.regiones[reg - 1].pk;

		var postdata = {
			'name': name,
			'neumonico': neumonico,
			'lat': lat,
			'lng': lng,
			'region': reg
		};
		(new Bridge(i, id, "sitios", postdata)).create(event);
	};
	this.save = function(event) {
		var name = document.querySelector("#popup4 .form_nombre").value;
		var neumonico = document.querySelector("#popup4 .neumonico").value;
		var lat = document.querySelector("#popup4 .lat").value;
		var lng = document.querySelector("#popup4 .lng").value;
		var reg = document.querySelector("#popup4 .optionRegion").selectedIndex;
		if (reg == 0) {
			alert("Debe seleccionar una región primero.");
			return;
		}
		reg = data.regiones[reg - 1].pk;

		var postdata = {
			'name': name,
			'neumonico': neumonico,
			'lat': lat,
			'lng': lng,
			'region': reg
		};
		(new Bridge(i, id, "sitios", postdata)).save(event);
	};
	this.delete = function(event) {
		(new Bridge(i, id, "sitios")).delete();
	};
}

function companie(i, id) {
	this.open = function() {
		abrir0();
		document.querySelector("#popup1 .form_nombre").value = data.companies[i].name;

		function searchRegion() {
			for (var e = 0; e < data.regiones.length; e++) {
				if ("Región " + data.regiones[e].nombre == data.companies[i].reg) {
					return e + 1;
				}
			}
		}
		document.querySelector("#popup1 .optionRegion").selectedIndex = searchRegion();
		document.querySelector("#popup1 #beliminar").onclick = (new companie(i, id)).delete
		document.querySelector("#popup1 #b_save").onclick = (new companie(i, id)).save;
	}
	this.create = function(event) {
		var name = document.querySelector("#popup2 .form_nombre").value;
		var reg = document.querySelector("#popup2 .optionRegion").selectedIndex;
		if (reg == 0) {
			alert("Debe seleccionar una región primero.");
			return;
		}
		reg = data.regiones[reg - 1].id;
		var postdata = {
			'name': name,
			'region': reg
		};
		(new Bridge(i, id, "companias", postdata)).create(event);
	}
	this.save = function(event) {
		var name = document.querySelector("#popup1 .form_nombre").value;
		var reg = document.querySelector("#popup1 .optionRegion").selectedIndex;
		if (reg == 0) {
			alert("Debe seleccionar una región primero.");
			return;
		}
		reg = data.regiones[reg - 1].id;
		var postdata = {
			'name': name,
			'region': reg
		};
		(new Bridge(i, id, "companias", postdata)).save(event);
	}
	this.delete = function(event) {
		(new Bridge(i, id, "companias")).delete();
	}
}

function dataSort() {
	// TODO AJAX JSON del servidor.
	data.sort(function(a, b) {
		if (a.first_name < b.first_name) {
			return -1;
		}
		if (a.first_name > b.first_name) {
			return 1;
		}
		return 0;
	});
};

function dataFormat(query) {
	var element = document.querySelector("#iabc");
	var lastLetter = '';
	query = query.toLowerCase()
	query = query.replace(/[\s-]/ig, "(\\s*)");
	query = query.replace(/[aàá]/ig, "[aàá]");
	query = query.replace(/[eèé]/ig, "[eèé]");
	query = query.replace(/[iìí]/ig, "[iìí]");
	query = query.replace(/[oòó]/ig, "[oòó]");
	query = query.replace(/[uùú]/ig, "[uùú]");
	var reg = new RegExp(query);

	if ((/^\/administradores/i).test(document.location.pathname)) {
		var usr;
		usr = admin;
		// Importar adminDataFormat.js
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/supervisores/i).test(document.location.pathname)) {
		var usr;
		usr = supervisor;
		// Importar adminDataFormat.js
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/proveedores/i).test(document.location.pathname)) {
		// Importar proveedoresDataFormat.js
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/proveedor/i).test(document.location.pathname)) {
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/usuarios/i).test(document.location.pathname)) {
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/usuario/i).test(document.location.pathname)) {
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/supervision/i).test(document.location.pathname)) {
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/sitios/i).test(document.location.pathname)) {
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if ((/^\/companias/i).test(document.location.pathname)) {
		innerDataFormat(element, lastLetter, query, reg, usr);
		return;
	}
}

function fechaToString(fecha) {
	if (fecha == null) {
		return ""
	}
	fecha = fecha.replace(/ /, "T")
	fecha = (new Date(fecha));
	fecha.setTime(fecha.valueOf() + (fecha.getTimezoneOffset() * 60 * 1000));
	var pad = function(n) {
		if (n < 10) {
			return '0' + n;
		}
		return n;
	}
	return fecha.getFullYear() + 
		"-" + pad(fecha.getMonth()) + 
		"-" + pad(fecha.getDate()) + 
		" " + pad(fecha.getHours()) + 
		":" + pad(fecha.getMinutes());
}

var csrftoken;

var inputDOM;
$(document).ready(function() {
	csrftoken = getCookie('csrftoken');
	$("#dialogError").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		buttons: [{
			text: "Ok",
			click: function() {
				$(this).dialog("close");
			}
		}]
	});
	$("#dialogPass").dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		close: function() {
	        $('.myp').val( "" );
	    }
	});
	dataFormat('');
	inputDOM = document.querySelector("#busqueda input");
	if (inputDOM) {
		inputDOM.oninput = function(event) {
			dataFormat(inputDOM.value);
		};
	};
});