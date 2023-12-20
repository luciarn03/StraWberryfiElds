class Fondo{
    constructor(nombrePais, nombreCapital, coordenadas){
        this.nombrePais= nombrePais;
        this.nombreCapital= nombreCapital;
        this.coordenadas= coordenadas;
    }
    getImagen(){
        var flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
        var splitted = this.coordenadas.split(',');
        var latitud = splitted[0]
        var longitud= splitted[1]
            $.getJSON(flickrAPI, 
                    {
                        "api_key" : "31f5529d3ec8bc6934ff67471a0e3d08",
                        "tags":"Etiopia",
                        "format": "json",
                        "nojsoncallback" : "1"
                    })
                .done(function(data) {
                    var photo = data.photos.photo[6];
                    var srcUrl = "https://live.staticflickr.com/"+ photo.server + "/"+ photo.id + "_" + photo.secret + "_b.jpg";
                    $("body").css("background", "no-repeat url(" + srcUrl + ") center/cover fixed");
            });
        }


}

var fondo = new Fondo("etiopia","addis abeba","38.7468900,9.0249700")