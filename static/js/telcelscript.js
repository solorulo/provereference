function abrir(){
		document.querySelector("#popup1").style.webkitTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup1").style.webkitTransform = "scale(1)";
		document.querySelector("#popup1").style.msTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup1").style.msTransform = "scale(1)";
		document.querySelector("#popup1").style.transition = ".2s transform ease-in 0s";
		document.querySelector("#popup1").style.transform = "scale(1)";


	};
	function cerrar(){
		document.querySelector("#popup1").style.webkitTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup1").style.webkitTransform = "scale(0)";
		document.querySelector("#popup1").style.msTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup1").style.msTransform = "scale(0)";
		document.querySelector("#popup1").style.transition = ".4s transform ease-in 0s";
		document.querySelector("#popup1").style.transform = "scale(0)";



	};
	function abrir1(){
			document.querySelector("#popup2").style.webkitTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup2").style.msTransform = "scale(1)";
		document.querySelector("#popup2").style.msTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup2").style.webkitTransform = "scale(1)";
		document.querySelector("#popup2").style.transition = ".2s transform ease-in 0s";
		document.querySelector("#popup2").style.transform = "scale(1)";

	};
	function cerrar1(){
		document.querySelector("#popup2").style.webkitTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup2").style.webkitTransform = "scale(0)";
		document.querySelector("#popup2").style.msTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup2").style.msTransform = "scale(0)";
		document.querySelector("#popup2").style.transition = ".4s transform ease-in 0s";
		document.querySelector("#popup2").style.transform = "scale(0)";



	};
	function abrir2(){
		document.querySelector("#popup3").style.webkitTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup3").style.webkitTransform = "scale(1)";
		document.querySelector("#popup3").style.msTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup3").style.msTransform = "scale(1)";
		document.querySelector("#popup3").style.transition = ".2s transform ease-in 0s";
		document.querySelector("#popup3").style.transform = "scale(1)";


	};
	function cerrar2(){
		document.querySelector("#popup3").style.webkitTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup3").style.webkitTransform = "scale(0)";
		document.querySelector("#popup3").style.msTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup3").style.msTransform = "scale(0)";
		document.querySelector("#popup3").style.transition = ".4s transform ease-in 0s";
		document.querySelector("#popup3").style.transform = "scale(0)";



	};
	function abrir3(){
		document.querySelector("#popup4").style.webkitTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup4").style.webkitTransform = "scale(1)";
		document.querySelector("#popup4").style.msTransition = ".2s transform ease-in 0s";
		document.querySelector("#popup4").style.msTransform = "scale(1)";
		document.querySelector("#popup4").style.transition = ".2s transform ease-in 0s";
		document.querySelector("#popup4").style.transform = "scale(1)";


	};
	function cerrar3(){
		document.querySelector("#popup4").style.webkitTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup4").style.webkitTransform = "scale(0)";
		document.querySelector("#popup4").style.msTransition = ".4s transform ease-in 0s";
		document.querySelector("#popup4").style.msTransform = "scale(0)";
		document.querySelector("#popup4").style.transition = ".4s transform ease-in 0s";
		document.querySelector("#popup4").style.transform = "scale(0)";



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
function compareNames(a,b) {
	if (a.name < b.name)
	 	return -1;
 	if (a.name > b.name)
		return 1;
  	return 0;
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

	data.sort(compareNames)
	for (var i = 0; i < data.length; i++) {

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
		conf.onclick = abrir;
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

window.onload = function(){
	dataFormat('');
	var inputDOM = document.querySelector("#busqueda input");
	inputDOM.oninput = function (event) { dataFormat(inputDOM.value); };
}
