"use strict";
class Sudoku{
    constructor(tablero){
        this.tablero= tablero;
        this.numOfFilas= 9;
        this.numOfColumnas = 9;
        this.sudoku= Array.from({ length: this.numOfFilas }, () => new Array(this.numOfColumnas));
        this.start();
    }

    start(){
       let k=0
        for(let i= 0; i < this.numOfFilas;i++){
            for(let j=0; j < this.numOfColumnas;j++){
                if(this.tablero[k]== "."){
                    this.sudoku[i][j]= 0;
                    k++;
                }else{
                    this.sudoku[i][j]= this.tablero[k++];
                }
                
            }
        }

    }

    onClickMethod(sudoku){
        sudoku.resetAnyClicked();
        this.setAttribute("data-state", "clicked");
    }
    resetAnyClicked(){
        var pars = document.querySelectorAll("p");
        for(let i = 0; i < pars.length;i++){
            if(pars[i].getAttribute("data-state")==="clicked"){
                pars[i].setAttribute("data-state", "default");
            }
        }
    }
    createStructure(){
        var main = document.querySelector("main");
        for(let i= 0; i < this.numOfFilas;i++){
            for(let j=0; j < this.numOfColumnas;j++){
            let p = document.createElement("p"); 
            p.textContent= this.sudoku[i][j]!="0"?this.sudoku[i][j]:""
            p.setAttribute("data-state","blocked");
            p.setAttribute("data-row",i);
            p.setAttribute("data-col",j);
            if(this.sudoku[i][j]==0){
                p.onclick = this.onClickMethod.bind(p,this);
                p.setAttribute("data-state","default");
            }
            
            main.appendChild(p);
        }
    }
}
   
    paintSudoku(){
        this.createStructure();
    }
    checkKey(sudoku,event){
        var pars = this.querySelectorAll("p");
        var selected ;
        for(let i = 0; i < pars.length;i++){
            if(pars[i].getAttribute("data-state")==="clicked"){
                selected= pars[i];
            }
        }
            if ( event.keyCode>=48 && event.keyCode<=57 &&selected!=undefined) {
                sudoku.introduceNumber(event.keyCode);
            }else{
                alert('Selecciona una celda');
            }

    }

    introduceNumber(code){
        var introduced = String.fromCharCode(code);
        var pars = document.querySelectorAll("p");
        var selected ;
        for(let i = 0; i < pars.length;i++){
            if(pars[i].getAttribute("data-state")==="clicked"){
                selected= pars[i];
            }
        }
        let notInRow=true;
        let notInCol=true;
        let notInBox = true;
        let row = parseInt(selected.getAttribute("data-row"))
        let col = parseInt(selected.getAttribute("data-col"))
        for(let i = 0; i < this.numOfColumnas-1;i++){
            if(this.sudoku[row][i]== introduced){
                notInRow= false;//num found on row
            }
        }

        for(let i = 0; i < this.numOfFilas-1;i++){
            if(this.sudoku[i][col]== introduced){
                notInCol= false;//num found on col
            }
        }

        const startRow = row - (row % 3), startCol = col - (col % 3);
    
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (i !== row && j !== col) {
                    if (this.sudoku[i][j] == introduced) {
                        notInBox= false;
                    }
                }
            }
        }
        if(notInBox&&notInRow&&notInCol){
            selected.onclick= null;
            selected.setAttribute("data-state", "correct");
            selected.textContent= introduced;
            this.sudoku[row][col]= introduced;
        }
        //checking if full
        var isCorrect = true;
        var pars = document.querySelectorAll("p");
        for(let i = 0; i < pars.length;i++){
            if(pars[i].getAttribute("data-state")==="clicked"||pars[i].getAttribute("data-state")==="default"){
                isCorrect= false;
            }
        }
        if(isCorrect){
            alert("Sudoku finalizado");
        }

    
    }
}

var sudoku = new Sudoku("3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6");
