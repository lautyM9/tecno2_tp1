//variables globales para calibración estoy acaaaaa
let AMP_MIN = 0.002;
let AMP_MAX = 0.04;

let FREC_MIN = 100;
let FREC_MAX = 150;
// lo demás sonido
let audioContext;
let mic;
//let amp;
let pitch;
let gestorAmp;
let gestorPitch;

let haySonido;
let antesHabiaSonido;

let estado = "agregar";
let tamInicial;
let tamFinal;

let trazoS;

let trazos = [];
let cantidad = 14;
let tiempoEntreTrazos = 300;
let ultimoTrazado = 0;

let posiciones = [];
let indiceTrazado = 0;
//-----------------------------pruebaaaa----------------
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
                  
//let up =random(0,800);

let dibujarTrazos = false;

let vibrar = false;
let fondo;
let paletaR;

let marca;
let tiempoLimiteAgregar = 3000;
let tiempoLimiteGrosor = 3000;
let tiempoLimiteColor = 3000;
let tiempoLimiteFin = 3000;

function preload() {
  for (let i = 0; i < cantidad; i++) {
    let nombre = "Data/trazo" + nf(i, 2) + ".png";
    trazos[i] = loadImage(nombre);
  }
  
}

function setup() {
  createCanvas(windowWidth, windowHeight); //1400, 800
  audioContext=getAudioContext();//inicia el motor de audio 
  frameRate(60);
  mic= new p5.AudioIn(); // inicia el microfono
  mic.start(startPitch);  //se enciende el micro y le transmito el analisis de frecuencia (pitch) al micro. Con esto conecto la libreria al microfono.
   
  //fondo=new Forma("Data/figura3.jpg");

  userStartAudio(); 

   gestorAmp =  new GestorSenial( AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial( FREC_MIN, FREC_MAX);

  antesHabiaSonido = false;
  
  tamInicial = 0.5; // IR PROBANDO TAMS QUE SEAN VISIBLES
  tamNormal =1.5
  tamFinal = 3;
}

function draw() {
//-------------------------COLOR DE FONDO----------------
  let factor = constrain(posiciones.length / 100, 0, 1); 
  let r = lerp(255, 235, factor);  
  let g = lerp(255, 225, factor);  
  let b = lerp(255, 190, factor);  
  background(r, g, b);

  blendMode(MULTIPLY);
  //----------------------FIN DE COLOR DE FONDO-----------------------
  // -----------------INICIO EVENTOS CON EL PITCH------------------
  let vol = mic.getLevel(); // cargo en vol la amplitud del micrófono (señal cruda);
  gestorAmp.actualizar(vol);

  haySonido = gestorAmp.filtrada > 0.1; // umbral de ruido que define el estado haySonido

  let inicioElSonido = haySonido && !antesHabiaSonido; // evendo de INICIO de un sonido
  let finDelSonido = !haySonido && antesHabiaSonido; // evento de fIN de un sonido

  // ------------------FIN EVENTOS CON EL PITCH------------------

  //---------------INICIO DE LOS ESTADOS DEL TRAZO (DESP ALTERAR,NO BORRAR)---------------
  if(estado == "agregar"){ //PARA QUE SE EMPIECEN A LOS TRAZOS
    if(inicioElSonido){ //Evento
        trazoS= new trazo();
      
     
      //console.log("nuevo rectangulo");
    }
/*
    if(cantidad > 10){
      //estado = "grosor";
    }
  */

    if(haySonido){ //Estado
        dibujarTrazos = true;
    }

    if(finDelSonido){//Evento
      marca = millis();
    }
    if(!haySonido){ //Estado SILENCIO
      let ahora = millis();
    
      /*if(ahora > marca + tiempoLimiteAgregar){
       
        estado = "grosor";
        marca = millis();
     
      }
        */
        dibujarTrazos = false;
    }
  

  }else if (estado == "grosor"){ //ESTE PUEDE SER tamaño

    if(inicioElSonido){ //Evento
    }
  
    if(haySonido){ //Estado
      
      tamNormal++;
    }

    if(finDelSonido){//Evento
      marca = millis();
    }

    if(!haySonido){ //Estado SILENCIO
      let ahora = millis();
      if(ahora > marca + tiempoLimiteGrosor){

        estado = "color";
        marca = millis();
      }
    }

  }else if (estado == "color"){ //ESTE PUEDE SER TAMAÑO 

    if(inicioElSonido){ //Evento
     
    }
  
    if(haySonido){ //Estado
      elColor = lerpColor( tamInicial, tamFinal, gestorPitch.filtrada);
    }

    if(finDelSonido){//Evento
      marca = millis();
    }
    
    if(!haySonido){ //Estado SILENCIO
      let ahora = millis();
      if(ahora > marca + tiempoLimiteColor){

        estado = "fin";
        marca = millis();
      }
    }
    
  }else if (estado == "fin"){

    if(inicioElSonido){ //Evento
      marca = millis();
    }
  
    if(haySonido){ //Estado

      let ahora = millis();
      if(ahora > marca + tiempoLimiteFin){
        estado = "reinicio";
        marca = millis();
      }
    }

    if(finDelSonido){//Evento
    }
    
    if(!haySonido){ //Estado SILENCIO
    }
    
  }else if (estado == "reinicio"){

    trazos =  [];
    cantidad = 0;
    estado = "agregar";
    tamNormal = 1.5
    marca = millis();
  } 
  // --------------PRUEBA DE DIBUJO DE TRAZOS---------------------------
 if (dibujarTrazos) {
  pitch = mic.getLevel();
  let x = random(width);
  let y = random(height);
  let angulo = random(360);
  let escala = map(pitch, FREC_MIN, FREC_MAX, 0.5,1.5);
  posiciones.push([int(random(cantidad)), x, y, angulo, escala]);
}

  // --------------Dibujar todos los trazos acumulados-------------------
  for (let i = 0; i < posiciones.length; i++) {
    let [cual, x, y, angulo, escala = 1] = posiciones[i]; // escala por compatibilidad

    // Vibración opcional
    let jitterX = vibrar ? random(-3, 3) : 0;
    let jitterY = vibrar ? random(-3, 3) : 0;
    let jitterA = vibrar ? random(-5, 5) : 0;

    push();
    translate(x + jitterX, y + jitterY);
    rotate(radians(angulo + jitterA));
    imageMode(CENTER);

    // Usar la escala para ajustar el tamaño del trazo
    let ancho = trazos[cual].width * escala;
    let alto = trazos[cual].height * escala;
    image(trazos[cual], 0, 0, ancho, alto);
    pop();
  }
 
  blendMode(BLEND);

  //para sonido---------------------------------------
 amp = mic.getLevel(); 
// La pelotita----------------------------------
  push();

  textSize(20);
  fill(0);
  let texto = "Amplitud: " + nfc(amp, 3);
  text(texto, 50, 50);

  noStroke();
  fill(255, 0, 0);
  let posY = map(amp, AMP_MIN, AMP_MAX, height, 0);
  ellipse(width/2, posY, 30, 30);

  pop();
  // -----------------------confirma que se dibujaa-------------------------
text("Trazos: " + posiciones.length, 50, 80);


}
//----------------------------(((((((PITCH)))))))----------------------------------------
//inicia el modelo de Machine Learning para deteccion de pitch (altura tonal)
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}
//--------------------------------------------------------------------
function modelLoaded() {
//select('#status').html('Model Loaded');
getPitch();
//console.log( "entro aca !" );
}
//--------------------------------------------------------------------
function getPitch() {
  pitch.getPitch(function(err, frequency) {
    //aca ingresa la frecuencia 'cruda'
  if (frequency) {
    //transforma la frevcuencia en nota musical
    let numeroDeNota = freqToMidi(frequency);
    console.log( numeroDeNota );

    gestorPitch.actualizar( numeroDeNota );

  }

  getPitch();
})
}

function reiniciarObra() {
  posiciones = [];
  //miDir_y_Vel = new Dir_y_Vel();

}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    reiniciarObra();
  }
    if (key === 'x' || key === 'X') {
    vibrar = true;
  }


}
function keyReleased() {
  if (key === 'x' || key === 'X') {
    vibrar = false;
  }
}



