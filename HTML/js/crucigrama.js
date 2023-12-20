class Crucigrama{
    constructor(tablero){
        this.tablero= tablero;
        this.numOfFilas= 11;
        this.numOfColumnas = 9;
        this.init_time;
        this.endTime;
        this.crucigrama= Array.from({ length: this.numOfFilas }, () => new Array(this.numOfColumnas));
        this.dificulty='facil'
        this.isFormActivated = false;
        this.start()
    }
    start(){
        var splitted = this.tablero.split(",")
        var k=0
        for(let i= 0; i < this.numOfFilas;i++){
            for(let j=0; j < this.numOfColumnas;j++){
                if(splitted[k]== "."){//vacio
                    this.crucigrama[i][j]= 0;
                    k++;
                }
                else if(splitted[k]=="#"){//bloqueado
                    this.crucigrama[i][j]=-1;
                    k++;
                }
                else{
                    this.crucigrama[i][j]= splitted[k++];
                }
                
            }
        }
    }

    paintMathword(){
        $("main").find("p").remove();
        //crear los parrafos atraves de jquery
        for(let i=0; i < this.numOfFilas;i++){
            for(let j=0; j < this.numOfColumnas; j++){
                if(this.crucigrama[i][j]==0){
                    $("main").append("<p data-state='default' data-row="+i+" data-col= "+j+"></p>");

                }else if(this.crucigrama[i][j]==-1){
                    $("main").append("<p data-state='empty' data-row="+i+" data-col= "+j+"></p>");
                }else{
                    $("main").append("<p data-state='blocked' data-row="+i+" data-col= "+j+">"+this.crucigrama[i][j]+"</p>");
                }
            }
        }
        this.addListeners();
        //inicializar init time
        this.init_time=  Date.now();
    }
    addListeners(){
        $(document).ready(function(){
            $("p[data-state='default']").on("click", function(){
                var pars= $('p')
                for(let i = 0; i < pars.length;i++){
                    if(pars[i].getAttribute("data-state")==="clicked"){
                        pars[i].setAttribute("data-state", "default");
                    }
                }
                $(this).attr("data-state", "clicked");
                    
            });
        });
        
    }

    check_win_condition(){
        for(let i= 0; i < this.numOfFilas;i++){
            for(let j=0; j < this.numOfColumnas;j++){
                if(this.crucigrama[i][j]==0){
                    return false;
                }

            }
        }
        return true;
    }

    calculate_date_difference(){
        var milliseconds = this.endTime - this.init_time;
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours}: ${minutes % 60}:${seconds % 60}`;
    }

    checkKey(crucigrama,event){
        //var pars = this.querySelectorAll("p");
        var pars= $('p')
        var selected ;
        for(let i = 0; i < pars.length;i++){
            if(pars[i].getAttribute("data-state")==="clicked"){
                selected= pars[i];
            }
        }
        if(selected!=undefined){
            if (( (event.key>=1 && event.key<=9) ||
                event.key=='+' ||event.key=='-'
                || event.key=='*' ||event.key=='/' )) {
                    
                crucigrama.introduceElement( event.key );
            }else if(event.key=="Shift"||event.key=="Command"||event.key=="Meta"||event.key=="Alt"|| event.key=="AltGraph"){

            }else if(event.key=="Backspace"||event.key=="Delete"){
                selected.innerHTML="";
            }
            else{
                if(!crucigrama.isFormActivated){
                        alert('Valor no válido')
                    }
                    
                }
        }else{
            if(!crucigrama.isFormActivated){
            alert('Selecciona una celda');  }
        }
        

    }

    introduceElement(key){
        var selected;
        var pars= $('p')
        for(let i = 0; i < pars.length;i++){
            if(pars[i].getAttribute("data-state")==="clicked" ){
                var posX= Number(pars[i].getAttribute("data-row"))
                var posY= Number(pars[i].getAttribute("data-col"))
                selected = pars[i];
            }
        }
        if(key=="Borrar"){
            //this.crucigrama[posX][posY]=0;
            selected.innerHTML="";
            return;
        }
        
        if(posX==undefined && posY==undefined){
            alert("Pulsa una casilla");
        }else if(key==="Borrar"){

        }
        else{
            var introduced = key;
            this.crucigrama[posX][posY]=introduced;
            var expression_row=true;
            var expression_col=true;
            var first_number;
            var second_number;
            var expression;
            var result;

            if(posY+1<=this.numOfColumnas-1){
                if(this.crucigrama[posX][posY+1]!=-1){
                    for(let j=posY+1; j < this.numOfColumnas; j++){
                        if(this.crucigrama[posX][j]=="="){
                            first_number= this.crucigrama[posX][j-3];//first num 3 pos a la izq
                            second_number = this.crucigrama[posX][j-1];
                            expression= this.crucigrama[posX][j-2];
                            result= this.crucigrama[posX][j+1];
                            break;
                        }
                    }
                    if(first_number!=0&& second_number!=0&& expression!=0&& result!=0){
                        var elements= [first_number, expression,second_number]
                        try{
                            expression_row= (result==eval(elements.join('')));
                        }catch{
                            alert('Expresión no válida');
                            return;
                        }
                        
                    }
                }
            }

            if(posX+1 <= this.numOfFilas-1){
                if(this.crucigrama[posX+1][posY]!=-1){
                    for(let i=posX+1; i < this.numOfFilas; i++){
                        if(this.crucigrama[i][posY]=="="){
                            first_number= this.crucigrama[i-3][posY];//first num 3 pos a la izq
                            second_number = this.crucigrama[i-1][posY];
                            expression= this.crucigrama[i-2][posY];
                            result= this.crucigrama[i+1][posY];
                            break;
                        }
                    }
                    if(first_number!=0&& second_number!=0&& expression!=0&& result!=0){
                        var elements= [first_number,  expression,second_number]
                        try{
                            expression_col=(result==eval(elements.join('')));
                        }catch{
                            alert('Expresión no válida');
                            return;
                        }
                        
                    }
                }
            }
            
            var p = $("p")
            if(expression_col&&expression_row){
                for(let k=0; k<p.length;k++){
                    if(p[k].getAttribute('data-row')==posX&&p[k].getAttribute('data-col')==posY){
                        p[k].innerHTML=introduced;
                        p[k].setAttribute('data-state','correct');
                    }
                }
            }else{
                for(let k=0; k<p.length;k++){
                    if(p[k].getAttribute('data-row')==posX&&p[k].getAttribute('data-col')==posY){
                        p[k].setAttribute('data-state','clicked');
                    }
                }
                this.crucigrama[posX][posY]=0;
                alert('Valor introducido incorrecto');
            }

            if(this.check_win_condition()){
                this.endTime= Date.now();
                var difference = this.calculate_date_difference();
                alert(difference);
                //llamada a creacion de form
                this.createRecordForm();
                this.isFormActivated=true;
            }
            }
        
    }

    createRecordForm(){
        
        var form = "<form action='#' method='post' name='clasificacion'>";
        form += '<label for="nombre">Nombre:</label>';
        form += '<input type="text" id="nombre" name="nombre" required>';
        form += '<label for="apellidos">Apellidos:</label>';
        form += '<input type="text" id="apellidos" name="apellidos" required>';
        form += '<label for="dificultad">Dificultad:</label>';
        form += '<input type="text" id="dificultad" name="dificultad" value="' + this.dificulty + '" readonly>';
        form += '<label for="tiempo">Tiempo:</label>';
        form += '<input type="number" id="tiempo" name="tiempo" value="' + Math.floor((this.endTime - this.init_time) / 1000) + '" readonly>';
        form += '<input type="submit" value="Enviar">';
        form += '</form>';
        var sectionFormulario='<section data-type="formulario">'+ form +'</section>'
        $('body').append(sectionFormulario);
    }

    selectDificulty(dificulty){
        this.isFormActivated=false;
        this.dificulty = dificulty;
        if(dificulty==="facil"){
            this.tablero = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
            
        }else if(dificulty === "medio"){
            this.tablero = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32"
        }else if(dificulty === "dificil"){
            this.tablero = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72"
        }
        // Mostrar en consola cuántas secciones se han seleccionado
        
        this.start();
        console.log(dificulty)
        this.paintMathword();

        $('section[data-type="clasificacion"]').remove();

        var sections = document.querySelectorAll('section'); // Obtener todas las divisiones

        if (sections.length >= 2) { // Asegurarse de que haya al menos dos divisiones
            var segundaSeccion = sections[2]; // Segunda división, índice 1
            var ultimaSeccion = sections[sections.length - 1]; // Obtener la última sección
            var penultimaSeccion = sections[sections.length - 1]; // Obtener la última sección

        // Eliminar la última sección del DOM
        if(sections.legth ==4){
            ultimaSeccion.remove();
            penultimaSeccion.remove();
        }
        
        var parrafosSegundaSeccion = segundaSeccion.querySelectorAll('p');
        parrafosSegundaSeccion.forEach(function(parrafo) {
            parrafo.remove();
        });
        var nuevoParrafo = document.createElement('p');
        nuevoParrafo.textContent = 'Dificultad actual: ' + dificulty;

        // Agregar el nuevo párrafo a la segunda sección
        segundaSeccion.appendChild(nuevoParrafo);
    }
}



}
//facil
var tablero = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
//medio
//var tablero = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32"
//dificil
//var tablero = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72"
var juego_crucigrama = new Crucigrama(tablero);