"use strict";
class Memoria{
    constructor(){
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements(){
        // Loop through array starting at the last index
        for (let i = this.elements.members.length - 1; i > 0; i--) {
          // Generate a random index from 0 to i
          const j = Math.floor(Math.random() * (i + 1));

          // Swap elements at indexes i and j (single line)
          [this.elements.members[i], this.elements.members[j]] = [this.elements.members[j], this.elements.members[i]];
      }
    }
    unflipCards(){
      this.lockBoard=true;
      setTimeout(() => {
      this.firstCard.setAttribute("data-state", "unflipped");
      this.secondCard.setAttribute("data-state", "unflipped");
      this.resetBoard();
    }, "2500");
    }
    resetBoard(){
        this.firstCard= null;
        this.secondCard= null;
        this.hasFlippedCard=false;
        this.lockBoard=false;
    }
    checkForMatch(){
      
      if(this.firstCard.getAttribute("data-element")===this.secondCard.getAttribute("data-element")){
        this.disableCards();
      }else{
        
          this.unflipCards();
        
      }
    }

    disableCards(){
        this.firstCard.setAttribute("data-state", "revealed");
        this.secondCard.setAttribute("data-state", "revealed");
        this.resetBoard();
    }
    createElements(){
      for(let i = 0; i < this.elements.members.length;i++){
        let carta = this.elements.members[i]
        document.write('<article data-element='+carta["element"]+' data-state=unflipped >');
        document.write("<h3>");
        document.write("Tarjeta de Memoria");
        document.write("</h3>");
        document.write("<img src="+carta["source"]+" alt="+carta["element"]+" />");
        document.write("</article>");

      }
    }

    addEventListeners(){
      var articles = document.querySelectorAll("article");
      for(let i=0; i < articles.length;i++){
        articles[i].onclick=this.flipCard.bind(articles[i], this);

        //bind se aplica a flipCard donde el this es articles[i]
        //y el this que yo le paso es el primer parametro para la funcion (llamado game)


      }
    }

    flipCard(game){//this == articles[i]
      if(game.lockBoard || this["data-state"] === "revealed"){
        return;
      }
      if(game.firstCard != null){
      if(this["data-state"] == "flipped"){
        return;
      }}
      this.setAttribute("data-state","flipped");
      if(game.hasFlippedCard){
        game.secondCard=this;
        game.checkForMatch();
      }else{
        game.firstCard= this;
        game.hasFlippedCard=true;
      }
    
    }


elements = {
    "members": [
      {
        "element" : "HTML5",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
      },
      {
        "element" : "CSS3",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
      },
      {
        "element" : "JS",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
      },
      {
        "element" : "PHP",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
      },
      {
        "element" : "SVG",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
      },
      {
        "element" : "W3C",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
      },
      {
        "element" : "HTML5",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
      },
      {
        "element" : "CSS3",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
      },
      {
        "element" : "JS",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
      },
      {
        "element" : "PHP",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
      },
      {
        "element" : "SVG",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
      },
      {
        "element" : "W3C",
        "source" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
      }
    ]
  }
}

