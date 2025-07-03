/*class trazo{

    constructor(){
        this.x; //width/2;
        this.y;//height/2;
        this.vibrar = false;
    }

    dibujar(){
   
 for (let i = 0; i < posiciones.length; i++) {
    let [cual, this.x, this.y, angulo, escala = 1] = posiciones[i]; // escala por compatibilidad

    // Vibración opcional
    let jitterX = this.vibrar ? random(-3, 3) : 0;
    let jitterY = this.vibrar ? random(-3, 3) : 0;
    let jitterA = this.vibrar ? random(-5, 5) : 0;

    push();
    translate(this.x + jitterX, this.y + jitterY);
    rotate(radians(angulo + jitterA));
    imageMode(CENTER);

    // Usar la escala para ajustar el tamaño del trazo
    let ancho = trazos[cual].width * escala;
    let alto = trazos[cual].height * escala;
    image(trazos[cual], 0, 0, ancho, alto);
    pop();
  }
    }

    setGrosor (valor){
        this.grosor = map(valor, 0, 1, 30, 1);
    }

}
*/
class trazo {
  constructor(x, y, angulo, indice, escala = 1) {
    this.x = x;
    this.y = y;
    this.angulo = angulo;
    this.indice = indice;
    this.escala = escala;
    this.grosor = 1;
  }

  actualizarGrosor(valor) {
    this.grosor = map(valor, 0, 1, 0.3, 2.5);
  }

  dibujar() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angulo));
    imageMode(CENTER);

    let ancho = trazos[this.indice].width * this.escala * this.grosor;
    let alto = trazos[this.indice].height * this.escala * this.grosor;
    image(trazos[this.indice], 0, 0, ancho, alto);
    pop();
  }
}
