class Api{
    /*Para probar el funcionamiento de esta clase recomiendo utilizar el video friday.mp4 y el documento de subtitulos friday.srt
    encontrados en la carpeta MULTIMEDIA */
    constructor(){
        if (window.File && window.FileReader && window.FileList && window.Blob){  
            //El navegador soporta el API File
            $('body').append("<p>Este navegador soporta el API File </p>");

        }
        else $('body').append("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");

        document.addEventListener(
            "keydown",
            (e) => {
                if (e.key === "Enter") {
                this.toggleFullScreen();
                }
            },
            false
        );
    }
          
    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    readInputFile(files){
        //lectura noticias.txt
        var archivo = files[0];
        var tipoVideo = /video.*/;
        
        if (archivo.type.match(tipoVideo)){
            var fileURL = URL.createObjectURL(archivo)
            $('body').append("<video src="+fileURL+" controls></video>");
            $('body').css("background", 'no-repeat url(" https://presco.com/engineered-film/wp-content/uploads/sites/2/2019/05/markets-cinema-screens-01.jpg ") center/cover fixed');
            $('input').hide();
            // 
            $('body').append('<p><label for="sub">Selecciona un archivo de subtitulo (multimedia/friday.srt):</label>');
            $('body').append('<input type="file" id="sub" onchange="api.readCaptions(this.files);">');
            $('body').append('</p><p>Presiona "Enter" para tener pantalla completa</p>');
            
        }else{
            alert("Error : ¡¡¡ Archivo no válido !!!");
        }
    }
    convertToSeconds(timeString) {
        const timeArray = timeString.split(':');
        const seconds = parseFloat(timeArray[2].replace(',', '.'));
        const minutes = parseInt(timeArray[1]);
        const hours = parseInt(timeArray[0]);
        const totalSeconds = seconds + minutes * 60 + hours * 3600;
        return totalSeconds.toFixed(2);
    }
    readCaptions(files){
        var archivo = files[0];
        var extension = ".srt";
        var extensionArchivo = archivo.name.split('.')[1];
        if (extension.match(extensionArchivo)){
            $('input').hide();
            $('p').hide();
            //create captions
            let video = document.querySelector("video");
            let track = video.addTextTrack("captions", "Captions", "en");
            track.mode = "showing";
            var lector = new FileReader();
            lector.onload = function (evento) {
                var contenido = lector.result;
                var splitted = contenido.split('\r\n');
                for(let i=1; i < splitted.length; i+=4){
                    var tiempos = splitted[i]
                    var tiempoSplitted = tiempos.split(' --> ')
                    var tiempoStart = this.convertToSeconds(tiempoSplitted[0]);
                    var tiempoFinish = this.convertToSeconds(tiempoSplitted[1]);
                    track.addCue(new VTTCue(tiempoStart, tiempoFinish, splitted[i+1]))
                }
            }.bind(this)
            lector.readAsText(archivo);
            $('body').append('<p>Presiona "Enter" para tener pantalla completa</p>');
        }else{
            alert("Error :¡¡¡ Archivo no válido !!!");
        }

        
    }

    
      

}
var api = new Api();
