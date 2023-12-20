class Agenda{
    constructor(url){
        this.url=url;
        this.last_api_call= null;
        this.last_api_result= null;
    }
    getInfoCarreras(){
        var ref = this;
        if((new Date()-this.last_api_call)>600000|| this.last_api_call==null){//every ten min
            $.ajax({
                dataType:"xml",
                method:"GET",
                url: this.url}).
                done( function(data){
                    ref.successAction(data);
                });
        }else{
            //pintar
            this.showInformation();
        }
       
    }
    showInformation(){
        $('Race',this.last_api_result).each((index,race)=>{
            //nombre de la carrera -> RaceName
            var nombre= $('RaceName', race).text()
            //nombre del circuito donde se celebra-> CircuitName
            var circuito= $('CircuitName',race).text()
            //coordenadas del circuito -> Location lat and long (attr)
            var lat = $('Location',race).attr('lat');
            var lon = $('Location',race).attr('long');
            //fecha y hora de la carrera -> date and time
            var date = $('Date',race)[0].textContent
            var hour = $('Time',race)[0].textContent.slice(0, -1);
            var sectionInicio = "<section>"
            var par ="<h2>"+nombre+"</h2>";
            var ul = "<ul> <li>Circuito: "+circuito+"<li>Lat: "+lat+" Lon:"+lon+ "<li> Date: "+date+ " "+ hour
            ul+=" </ul>"
            var sectionFinal = "</section>"
            $('body').append(sectionInicio+par+ul+sectionFinal);
            //console.log(nombre+circuito+lat+lon+date+hour);

        })
        console.log(this.last_api_result);
    }

    successAction(datos){
        this.last_api_call=new Date();
        this.last_api_result=datos;
        this.showInformation();
    }

}

var agenda = new Agenda("https://ergast.com/api/f1/2023");