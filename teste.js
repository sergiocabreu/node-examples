var xhttp2 = new XMLHttpRequest();
xhttp2.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) { 
		carregarPdfs(this);
	}
};
xhttp2.open("GET", "https://spreadsheets.google.com/feeds/list/1IJBDu8dRGLkBgX72sRWKY6R9GfefsaDCXBd3Dz9PZNs/14/public/values", true);
xhttp2.send();

//    function carregarProdutos(xml){
//      var xmlDoc = xml.responseXML;
//    }
    


function carregarPdfs(xml) { 
var xmlDoc = xhttp2.responseXML;
// var publicar = xmlDoc.getElementsByTagName('gsx:publicar');  
var pdf = xmlDoc.getElementsByTagName('gsx:pdf');
var titulo = xmlDoc.getElementsByTagName('gsx:titulo');  
var tipo = xmlDoc.getElementsByTagName('gsx:tipo');    
var boletimDestaque = document.getElementById("boletimDestaque");  
var boletinsAnteriores = document.getElementById("boletinsAnteriores");  

	for (i = 0; i < titulo.length; i++) {

		if (tipo[i].innerHTML == "destaque") {
			boletimDestaque.innerHTML  += `
			<h3><i class="text-pref fa fa-calendar"></i> `+titulo[i].innerHTML+` <a href="`+pdf[i].innerHTML+`" target="blank"><small><i class="fa fa-download"> baixar</i></small></a></h3>
			<iframe allowfullscreen allow="fullscreen" style="border:none;width:100%;height:750px;" src="https://docs.google.com/viewerng/viewer?url=`+pdf[i].innerHTML+`&embedded=true" frameborder="0"></iframe>
			<br><br>
			`;

		}else{
			boletinsAnteriores.innerHTML  += `
			<li>
			<a class="text-info" href="`+pdf[i].innerHTML+`">`+titulo[i].innerHTML+`</a>
			</li>
         `;

		}	

		
	}

	
}
