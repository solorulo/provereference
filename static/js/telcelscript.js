
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

function cerrar(selector) {
	document.querySelector(selector).style.webkitTransition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.webkitTransform = "scale(0)";
	document.querySelector(selector).style.msTransition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.msTransform = "scale(0)";
	document.querySelector(selector).style.transition = ".4s transform ease-in 0s";
	document.querySelector(selector).style.transform = "scale(0)";
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

}

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
}

function compareNames(a,b) {
	if (a.name < b.name)
		return -1;
	if (a.name > b.name)
		return 1;
	return 0;
}

function admin(i, id){
	this.a = i;
	this.e = id;
	this.open = function(){
		abrirAdmin(i, id);
	};
	this.save = function(event){
		event.preventDefault();
		var email = $('#popup1 .form_mail').val();
		var first_name = $('#popup1 .form_nombre').val();
		var last_name = $('#popup1 .form_apellido').val();
		var is_admin = document.querySelector("#popadministrador input").checked;
		var postdata={
			'email':email, 
			'first_name':first_name,
			'last_name':last_name,
			'is_admin':is_admin,
			'csrfmiddlewaretoken': csrftoken
		}
		$.post("/administradores/"+id+"/edit/", postdata, function(response) {
			// eval('var _jsonData = '+response);
			var code = response.code;
			//alert(response.code);
			if(code == '1'){
				data.splice(i, 1, {
							'email':email, 
							'first_name':first_name,
							'last_name':last_name,
							"tel":"45678654",
							"id" : id
						});
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
		$.post("/administradores/"+id+"/delete/", postdata, function(response) {
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
}

function dataFormat(query){
	var datahtml = "";
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

	emptyNode = document.createElement('div');
	emptyNode.setAttribute("id", "iabc");
	document.querySelector("#derecha").replaceChild(emptyNode, element);

	data.sort(compareNames);
	for (var i = 0; i < data.length; i++) {
		if (data[i].name == null){
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
		var conf = document.createElement("div");
		var img = document.createElement("img");
		var info = document.createElement("div");
		
		var nombreTextNode = document.createTextNode(data[i].name);
		var infoEmail = data[i].email;
		var infoTelefono = data[i].tel;
		var infoEmailNode = document.createTextNode(infoEmail);
		var infoTelefonoNode = document.createTextNode(infoTelefono);
		var confTextNode = document.createTextNode("Editar datos");
		
		contenedor.setAttribute("class", "contenedor");
		contenedor.setAttribute("id", data[i].id);
		nombre.setAttribute("class", "nombre");
		conf.setAttribute("class", "conf");
		conf.onclick = (new admin(i, data[i].id)).open;
		img.setAttribute("src", "../static/imagenes/Supervisar/configurar.png");
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
}
var csrftoken ;

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
	var inputDOM = document.querySelector("#busqueda input");
	inputDOM.oninput = function (event) { dataFormat(inputDOM.value); };
});
