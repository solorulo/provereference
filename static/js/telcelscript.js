
function abrirAdmin(i, id){
	abrir("#popup1");
	document.querySelector("#popup1 .form_nombre").value=data[i].first_name;
	document.querySelector("#popup1 .form_apellido").value=data[i].last_name;
	document.querySelector("#popup1 .form_mail").value=data[i].email;
	document.querySelector("#popadministrador input").checked = true;
	var obj = new admin(i, id)
	document.querySelector("#popup1 #beliminar").onclick = obj.delete;
	document.querySelector("#popup1 #b_save").onclick = obj.save;
};

function abrirSupervisor(i, id){
	abrir("#popup1");
	document.querySelector("#popup1 .form_nombre").value=data[i].first_name;
	document.querySelector("#popup1 .form_apellido").value=data[i].last_name;
	document.querySelector("#popup1 .form_mail").value=data[i].email;
	document.querySelector("#popadministrador input").checked = false;
	var obj = new supervisor(i, id)
	document.querySelector("#popup1 #beliminar").onclick = obj.delete;
	document.querySelector("#popup1 #b_save").onclick = obj.save;
}

function cerrar(selector) {
	document.querySelector(selector).style.webkitTransition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.webkitTransform = "scale(0)";
	document.querySelector(selector).style.msTransition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.msTransform = "scale(0)";
	document.querySelector(selector).style.transition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.transform = "scale(0)";
	// Formulario reset.
	var inputs = document.querySelectorAll(selector+" input[type=\"text\"]");
	for (var i = inputs.length - 1; i >= 0; i--) {
		inputs[i].value = '';
	};
	if ((/^\/administradores/i).test(document.location.pathname)){
		document.querySelector(selector+" input[type=\"checkbox\"]").checked = true;
	} else if((/^\/supervisores/i).test(document.location.pathname)){
		document.querySelector(selector+" input[type=\"checkbox\"]").checked = false;
	}
}

function cerrar0(){
	cerrar("#popup1");

};
function abrir0(){
	abrir("#popup1");

};
function abrir(selector){
	document.querySelector(selector).style.webkitTransition = ".2s transform ease-in 0s";
	document.querySelector(selector).style.msTransform = "scale(1)";
	document.querySelector(selector).style.msTransition = ".2s transform ease-in 0s";
	document.querySelector(selector).style.webkitTransform = "scale(1)";
	document.querySelector(selector).style.transition = ".2s transform ease-in 0s";
	document.querySelector(selector).style.transform = "scale(1)";

};
function abrir1(){
	abrir("#popup2");

};
function cerrar1(){
	cerrar("#popup2");
};
function abrir2(){
	abrir("#popup3");

};
function cerrar2(){
	cerrar("#popup3");

};
function abrir3(){
	abrir("#popup4");

};
function cerrar3(){
	cerrar("#popup4");

};
function activo(){
	document.querySelector("#popadministrador img").style.webkitTransform = "rotate(180deg)";
	document.querySelector("#popadministrador img").style.msTransform = "rotate(180deg)";
	document.querySelector("#popadministrador img").style.transform = "rotate(180deg)";

};

function subir(){
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

function Bridge(i, id, nombre, datos){
	this.create = function(event){
		event.preventDefault();
		var postdata = jQuery.extend({}, datos);
		postdata.csrfmiddlewaretoken = csrftoken;
		$.post("/"+nombre+"/new/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			// alert(code);
			if (code == 1) {
				datos.id = response.user_id;
				data.push(datos);
				dataSort();
				dataFormat('');
			}
			else {
				$("#dialogError").dialog("open");
			}
		}).fail(function() {
			$("#dialogError").dialog("open");
		});
		cerrar1();
	};
	this.save = function(event){
		event.preventDefault();
		var postdata = jQuery.extend({}, datos);
		postdata.csrfmiddlewaretoken = csrftoken;
		$.post("/"+ nombre +"/"+id+"/edit/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			// alert(response["code"]);
			if(code == '1'){
				datos.id = id;
				data.splice(i, 1, datos);
				dataSort();
				dataFormat('');
			}
			else if (code == '1.1') {
				data.splice(i, 1);
				dataFormat('');
			}
			else {
				$("#dialogError").dialog("open");
			}
		}).fail(function() {
			$("#dialogError").dialog("open");
		});
		cerrar0();
		return false;
	};
	this.delete = function(){
		event.preventDefault();
		var postdata={
			'csrfmiddlewaretoken': csrftoken
		}
		$.post("/"+ nombre +"/"+id+"/delete/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			// alert(code);
			if(code == '1'){
				data.splice(i, 1);
				dataFormat('');
			}
			else {
				$("#dialogError").dialog("open");
			}
		}).fail(function() {
			$("#dialogError").dialog("open");
		});
		cerrar0();
		return false;
	};
};

function admin(i, id){
	this.open = function(){
		abrirAdmin(i, id);
	};
	this.create = function(event){
		var email = $('#email').val();
		var first_name = $('#first_name').val();
		var last_name = $('#last_name').val();
		var postdata = {
			'email':email, 
			'first_name':first_name,
			'last_name':last_name,
			'is_admin':true,
			'tel':''
		};
		(new Bridge(i, id, "administradores", postdata)).create(event);
	};
	this.save = function(event){
		var email = $('#popup1 .form_mail').val();
		var first_name = $('#popup1 .form_nombre').val();
		var last_name = $('#popup1 .form_apellido').val();
		var is_admin = document.querySelector("#popadministrador input").checked;
		var postdata={
			'email':email, 
			'first_name':first_name,
			'last_name':last_name,
			'is_admin':is_admin,
			'tel':''
		}
		(new Bridge(i, id, "administradores", postdata)).save(event);
	}
	this.delete = function(){
		(new Bridge(i, id, "administradores")).delete();
	}
};

function supervisor(i, id){
	this.open = function(){
		abrirSupervisor(i, id);
	};
	this.create = function(event){
		var first_name = $("#first_name").val();
		var last_name = $("#last_name").val();
		var email = $("#email").val();
		var postdata = {
			'email':email, 
			'first_name':first_name,
			'last_name':last_name,
			'is_admin':false,
			'tel':''
		};
		(new Bridge(i, id, "supervisores", postdata)).create(event);
	};
	this.save = function(event){
		var email = $('#popup1 .form_mail').val();
		var first_name = $('#popup1 .form_nombre').val();
		var last_name = $('#popup1 .form_apellido').val();
		var is_admin = document.querySelector("#popadministrador input").checked;
		var postdata={
			'email':email, 
			'first_name':first_name,
			'last_name':last_name,
			'is_admin':is_admin,
			'tel':''
		};
		(new Bridge(i, id, "supervisores", postdata)).save(event);
	}
	this.delete = function(){
		(new Bridge(i, id, "supervisores")).delete();
	}
};

function dataSort(){
	data.sort(function(a, b){
		if (a.first_name < b.first_name){
			return -1;
		}
		if (a.first_name > b.first_name){
			return 1;
		}
		return 0;
	});
};

function dataFormat(query){
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

	if ((/^\/administradores/i).test(document.location.pathname)){
		var usr;
		usr = admin;
		// Importar adminDataFormat.js
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if((/^\/supervisores/i).test(document.location.pathname)){
		var usr;
		usr = supervisor;
		// Importar adminDataFormat.js
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else if((/^\/proveedores/i).test(document.location.pathname)){
		// Importar proveedorDataFormat.js
		innerDataFormat(element, lastLetter, query, reg, usr);
	} else {
		return;
	}
}

var csrftoken;

var inputDOM;
$(document).ready(function() {
	csrftoken = getCookie('csrftoken');
	$( "#dialogError" ).dialog({
		autoOpen: false,
		width: 400,
		buttons: [
			{
				text: "Ok",
				click: function() {
					$( this ).dialog( "close" );
				}
			},
		]
	});
	dataFormat('');
	inputDOM = document.querySelector("#busqueda input");
	inputDOM.oninput = function (event) { dataFormat(inputDOM.value); };
});
