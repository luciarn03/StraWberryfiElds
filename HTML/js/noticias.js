class Noticias{
    constructor(){
        //comprobar si el navegador soporta api file
        if (window.File && window.FileReader && window.FileList && window.Blob){  
            //El navegador soporta el API File
            $('body').append("<p>Este navegador soporta el API File </p>");

        }
            else $('body').append("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }
    readInputFile(files){
        //lectura noticias.txt
        var archivo = files[0];
        var contenido;
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)){
                var lector = new FileReader();
                lector.onload = function (evento) {
                    contenido = lector.result;
                    var splitted = contenido.split('\n');
                    for(let i=0; i < splitted.length; i++){
                        var splitted2= splitted[i].split('_')
                        var titulo= splitted2[0]
                        var subtitulo = splitted2[1]
                        var texto= splitted2[2]
                        var autor= splitted2[3]
                        $('body').append("<article> <h2>"+titulo+"</h2> <h3> "+subtitulo+" </h3> <p>"+texto+" </p> <p>"+autor+" </p></article>");
                            
                    }
            }      
            lector.readAsText(archivo);
            }
        else {
            console.log("Error : ¡¡¡ Archivo no válido !!!");
            }     
        
        console.log(files);
        console.log(contenido);
    }

    añadirNoticia(){
        var inputs= $("input");
        $("body").append("<article> <h2>"+inputs[1].value+"</h2> <h3> "+inputs[2].value+" </h3> <p>"+inputs[3].value+" </p> <p>"+inputs[4].value+" </p></article>");
    }

}

