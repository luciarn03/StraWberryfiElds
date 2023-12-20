class Viajes{
    constructor(){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        
    }
    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed; 
        this.mapaDinamico     = null; 
        this.curSlide = 9;  
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }
    getMapaEstaticoGoogle(){
        var ubicacion=document.querySelector('section[id="estatico"]');
        
        var apiKey = "&key=AIzaSyD9wpMt03Uu2Lj9UCAKotBJWjqWq2i5YdU";
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        //Parámetros
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud;
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=15";
        //Tamaño del mapa en pixeles (obligatorio)
        var tamaño= "&size=800x600";
        //Escala (opcional)
        //Formato (opcional): PNG,JPEG,GIF
        //Tipo de mapa (opcional)
        //Idioma (opcional)
        //region (opcional)
        //marcadores (opcional)
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        //rutas. path (opcional)
        //visible (optional)
        //style (opcional)
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        ubicacion.innerHTML = "<h2>Mapa Estático</h2><img src='"+this.imagenMapa+"' alt='mapa estático google' />";
    }
    getMapaDinamico(){
        var centro = {lat: this.getLatitud(), lng: this.getLongitud()};
        var mapaGeoposicionado = new google.maps.Map(document.getElementById('mapa'),{
            zoom: 8,
            center:centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infoWindow = new google.maps.InfoWindow;
        var pos = {
            lat: this.getLatitud(),
            lng:this.getLongitud()
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Localización encontrada');
            infoWindow.open(mapaGeoposicionado);
            mapaGeoposicionado.setCenter(pos);
            $('section[data-type="dinamico"]').prepend("<h2>Mapa dinamico</h2>");
            this.mapaDinamico = mapaGeoposicionado;
    }
    readKML(files){
        var extensionKML = "kml";

        for (let j = 0; j < files.length; j++) {
            let archivo = files[j];
            let extensionDelArchivo = archivo.name.split('.')[1];

            if (extensionDelArchivo===extensionKML) {
                let lector = new FileReader();
                lector.onload = (function (archivo) {
                    return function (evento) {
                        var map = this.getMapaDinamicoGoogleAtributo();
                        var contenido = lector.result;
                        var coordinates = $('coordinates', contenido).text().trim().split('\n');
                        var lines = new Array(coordinates.length);
                        for (let i = 0; i < coordinates.length; i++) {
                            var splitted = coordinates[i].split(',')
                            var centro = { lat: parseFloat(splitted[1]), lng: parseFloat(splitted[0]) };
                            
                            new google.maps.Marker({
                                position: centro,
                                map,
                                title: i + "",
                            });
                            lines[i] = {lat: parseFloat(splitted[1]), lng: parseFloat(splitted[0])};
                            /*Da un error de Invalid Value puede ser pq es asincrona */
                            var path = new google.maps.Polyline({
                                path: lines,
                                geodesic: true,
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                                });
                        
                                path.setMap(map);
                        
                                map.setCenter(centro);
                        }
                    };
                })(archivo);
                lector.onload = lector.onload.bind(this); // Agregar bind para mantener el contexto

                lector.readAsText(archivo);
            } else {
                console.log("Error: ¡Archivo no válido!");
            }
        }
        
    }

    readSVG(files){
        var extensionSVG = "svg";
        
        for (let j = 0; j < files.length; j++) {
            var archivo = files[j];
            var extensionDelArchivo = archivo.name.split('.')[1];
            if (extensionDelArchivo === extensionSVG) {
                this.readAndAppendSVG(archivo, j);
            } else {
                console.log("Error:¡ Archivo no válido !");
            }
        }
    }
    readAndAppendSVG(file, index) {
        var lector = new FileReader();

        lector.onload = function (evento) {
            var contenido = lector.result;
            var currentSvg = $("<svg data-item=" + index + "></svg>");

            $("polyline", contenido).appendTo(currentSvg);
            $("text", contenido).each((index, text) => {
                $(currentSvg).append(text);
            });

            $("section[data-type='svg']").append(currentSvg); // Agregar SVG al DOM
        };

        lector.readAsText(file);
    }

    readInputFile(files){
        var archivo = files[0];
        var extensionXML = "xml";
        var extensionDelArchivo = archivo.name.split('.')[1];
        if (extensionDelArchivo===extensionXML){
            var lector = new FileReader();
                    lector.onload = function (evento) {
                        var contenido = lector.result;
                        $('body').append('<section data-type="rutas"> </section>');
                        
                        $('ruta',contenido).each((index,ruta)=>{
                            let inicioSection= "<section>"
                            let finishSection="</section>"
                            let name= $(ruta).attr('nombre')
                            let transporte = $(ruta).attr('transporte')
                            let fechaInicio = $(ruta).attr('fechaInicio')
                            let horaInicio= $(ruta).attr('horaInicio')
                            let duracion=$(ruta).attr('duracion')
                            let regex = /^P(\d+D)?T?(\d+H)?(\d+M)?(\d+(\.\d+)?S)?$/;
                            let matches = regex.exec(duracion);
                            let days = matches[1] ? parseInt(matches[1]) : 0;

                            let agencia = $(ruta).attr('agencia')
                            let descripcion = $(ruta).attr('descripcion')
                            let tipo = $(ruta).attr('tipo')
                            let tipoPersona = $(ruta).attr('tipoDePersona')
                            let direccionInicio = $(ruta).attr('direccionInicio')
                            let recomendacion = $(ruta).attr('recomendacion')
                            let latitud =parseFloat( $('latitud',ruta).text()).toFixed(2)
                            let longitud = parseFloat($('longitud',ruta).text()).toFixed(2)
                            let altitud = $('altitud',ruta).first().text()

                            let titleH2 = "<h2>"+name+"</h2>"
                            let datosGenerales="<p>"+descripcion+"</p>"
                            datosGenerales+="<ul> "
                            datosGenerales+="<li>Transporte: "+transporte +"</li>"
                            if(fechaInicio.length !=0 && horaInicio!=0)
                                datosGenerales+="<li>Fecha de Inicio: "+fechaInicio + " "+horaInicio +"</li>"
                            datosGenerales+="<li>Duración: "+ days +" días</li>"
                            datosGenerales+="<li>Agencia: "+ agencia +"</li>"
                            datosGenerales+="<li>Tipo de ruta: "+ tipo +" Tipo de persona: "+tipoPersona+"</li>"
                            datosGenerales+="<li>Direccion de Inicio: "+ direccionInicio +"</li>"
                            datosGenerales+="<li>Coordenadas de Inicio: "+ latitud+","+longitud+","+altitud +"</li>"
                            datosGenerales+="<li>Recomendación: "+ recomendacion +"</li>"
                            let bibliografia = "";
                                $('enlace', ruta).each(function() {
                                bibliografia +='<li><a href="'+$(this).text()+'">'+$(this).text()+"</a></li>";
                            });
                            datosGenerales+="<li>Bibliografia: "+bibliografia+"</li>"
                            datosGenerales+="</ul>"
                            $('body').append(inicioSection+ titleH2+datosGenerales);
                            $('hito',ruta).each((index,hito)=>{
                                let name= $(hito).attr('nombre')
                                let distancia=$(hito).attr('distancia')
                                let latitud = parseFloat($('latitud',hito).text()).toFixed(2)
                                let longitud = parseFloat($('longitud',hito).text()).toFixed(2)
                                let altitud = $('altitud',hito).text()
                                let foto = $('foto',hito).text()
                                let video =$('video',hito).text()
                                let hitoInfo = "<h3> "+name+" </h3>"
                                hitoInfo+="<ul> <li> Distancia: "+ distancia+"m  </li><li>Coordenadas: "+ latitud+","+longitud+","+altitud +"</ul>"
                                hitoInfo+="<img src='xml/"+foto+"' alt='Foto Etiopia "+foto +" '/>"
                                if(video.length!=0)
                                    hitoInfo+='<video controls><source src="../xml/'+video+'" type="video/mp4"></video> '
                                $('body').append(hitoInfo);
                            })
                            
                            $('body').append(finishSection);
                        }
                )} 
                lector.readAsText(archivo);
                
        }else{
            console.log("Error : ¡¡¡ Archivo no válido !!!");
        }
    }


    nextSlide(){
        const slides = document.querySelectorAll("img");
        // select next slide button
        const nextSlide = document.querySelector("button[data-action='next']");
   
        // current slide counter
        let curSlide = 10;
        // maximum number of slides
        let maxSlide = slides.length - 1;

        // check if current slide is the last and reset current slide
        if (this.curSlide === maxSlide) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }
        //   move slide by -100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }

    previousSlide(){
        const slides = document.querySelectorAll("img");
        // select next slide button
        const prevSlide = document.querySelector("button[data-action='prev']");
        let maxSlide = slides.length - 1;
        // add event listener and navigation functionality
        // check if current slide is the first and reset current slide to last
        if (this.curSlide === 0) {
            this.curSlide = maxSlide;
        } else {
            this.curSlide--;
        }

        //   move slide by 100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }
    getLongitud(){
        return this.longitud;
    }
    getLatitud(){
        return this.latitud;
    }
    getAltitud(){
        return this.altitud;
    }
    getMapaDinamicoGoogleAtributo(){
        return this.mapaDinamico;
    }
}