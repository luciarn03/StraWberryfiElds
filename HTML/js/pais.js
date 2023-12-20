"use strict";
class Pais{
    constructor(nombrePais, nombreCapital, poblacion){
        this.nombreCapital= nombreCapital;
        this.nombrePais = nombrePais;
        this.poblacion = poblacion;
    }

    setInformacionSecundaria( formaDeGobierno, coordenadasCapital, religion){
        this.formaDeGobierno=formaDeGobierno;
        this.coordenadasCapital= coordenadasCapital;
        this.religion=religion;
    }
    

    setNombrePais(nombrePais){
        this.nombrePais= nombrePais;
    }
    setNombreCapital(nombreCapital){
        this.nombreCapital = nombreCapital;
    }
    setPoblacion(poblacion){
        this.poblacion=poblacion
    }
    setFormaDeGobierno(gobierno){
        this.formaDeGobierno=gobierno;
    }
    setCoordenadas(coordenadas){
        this.coordenadasCapital=coordenadas;
    }
    setReligion(religion){
        this.religion=religion;
    }

    getNombrePais(){
        return this.nombrePais;
    }
    getNombreCapital(){
        return this.nombreCapital;
    }
    getPoblacion(){
        return this.poblacion;
    }
    getFormaDeGobierno(){
        return this.formaDeGobierno;
    }
    getCoordenadasCapital(){
        return this.coordenadasCapital;
    }
    getReligion(){
        return this.religion;
    }

    getInformacionSecundaria(){
        return "<ul>"+"<li>"+ this.getPoblacion()+"</li>"+
        "<li>"+ this.getFormaDeGobierno()+"</li>"+
        "<li>"+ this.getReligion()+"</li>"+"</ul>";
    }
    writeCoordenadas(){
        document.write(this.getCoordenadasCapital());
    }

    getDatos(){
        var apikey= "bb3d7e3236ce4fa4785c8811165be565";
        var units="metric"
        var splitted = this.getCoordenadasCapital().split(',');
        var lat = splitted[0]
        var lon= splitted[1]

        var urlComplete="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apikey+"&units="+units+"&lang=es";
        $.ajax({
            dataType:"json",
            url: urlComplete,
            success:function(datos){
                var hour= datos.list[0].dt_txt;
                var timeString = hour.split(' ')[1];
                for(let i=0 ; i < 40 ; i++ ){
                    let forecastForDay = datos.list[i]
                    let temp_hour= datos.list[i].dt_txt.split(' ')[1];
                    if(timeString== temp_hour){
                        //dia
                        let dia= forecastForDay.dt_txt;
                        //temp max
                        let temp_max= forecastForDay.main.temp_max;
                        //temp min
                        let temp_min= forecastForDay.main.temp_min;
                        //% humedad
                        let humidity= forecastForDay.main.humidity;
                        //icono
                        let icon = forecastForDay.weather[0].icon;
                        let url_icon = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
                        //cantidad de lluvia
                        let rain = forecastForDay.rain==undefined?0:forecastForDay.rain['3h'];
                        let date = new Date(dia);
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        let hour = date.getHours();
                        let formattedDate = `${day}/${month} ${hour}h`;
                        var inicioSection='<section data-type="forecast">'
                        var finalSection ="</section>"
                        var ul= "<ul>  <li> Máxima: "+temp_max+"ºC"
                        ul+="<li>Mínima: "+temp_min+"ºC"
                        ul+="<li>Humedad: "+humidity+"%"
                        ul+="<li>Lluvia: "+rain+" mm"
                        ul+=" </ul>"
                        var par = "<h3>"+formattedDate+"</h3>";
                        var img=' <img src='+url_icon+' alt="Icono Meteorologico" />'
                        $('body section:eq(1)').append(inicioSection+par+img+ul+finalSection);
                    }
                }
            }
        });
    }

}

var etiopia = new Pais("Etiopia", "Adis Abeba","120,3 millones");
etiopia.setInformacionSecundaria(" República Federal Democrática con una base étnica", "9.027222,38.736944","Iglesia ortodoxa etíope" );


