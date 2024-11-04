game = {
    canvas: null,
    ctx: null,
    nivel1: {
        objeto1: null,
        objetos_array: ["Stone.png", "Stone_1.png", "Stone_2.png", "Stone_3.png"],
        objetos_pocision_array: [470, 540],
        imagenFondo: null,
        cantidadObjeto: 0,
        contadorTotal: 0,
        carro: [],
        arregloColisiones: [],
        numeroDeFrames: 0,
        movimiento: null,
        posicionCarro: 510,
        posicion: null,
        objeto: null,
        puntos: 0,
        estado: true,
        finNivel: false,
        teclaNumero: 0,
        inicioY: 0,
        altura: 0,
        dy: 2,
        cuadro: 1,
        anchoCarro: null,
        altoCarro: null

    },
    nivel2: {estado: false, finNivel: false},
    nivel3: {
        contador_objetos: 0,
        contador_mangos: 0,
        imagenEnemigo: null,
        imagenJugador: null,
        imagenMango: null,
        imagenObjeto: null,
        mango_array: new Array(),
        objeto_array: new Array(),
        enemigos_array: new Array(),
        colision_mango: [],
        colision_objeto: [],
        coleccion_mango: [],
        coleccion_objeto: [],
        puntos: 0,
        estado: false,
        finNivel: false
    },
    teclaPulsada: null,
    tecla: [],
    intro: true,
    imagenIntro: null,
    introFrame: [],
    finJuego: false,
    gameOver: false,
    gameOverFrame: [],
    imagenGameOver: null,
    levelUp: false,
    imagenLevelUp: null,
    levelUpFrame: [],
    win: false,
    imagenWin: null,
    winFrame: [],
    vidas: 5,
    menosVidas: 0,
    frameIndex: 0,
    start: false,
}

/*******************
 CONSTANTES
 ********************/
const KEY_ENTER = 13;
const KEY_LEFT = 65; // A
const KEY_UP = 87; // W
const KEY_RIGHT = 68; // D
const KEY_DOWN = 83; // S
const BARRA = 32; // Espacio
const NUM_RUN = 0;
const NUM_LEFT = 1;
const NUM_DOWN = 2;
const NUM_RIGHT = 3;
const NUM_JUMP = 4;
const NUM_DEAD = 5;
const NUM_CHOQUE = 6;

const ACCION = [
    {a: "Run", n: 1},
    {a: "Left", n: 1},
    {a: "Down", n: 1},
    {a: "Rigth", n: 1},
    {a: "Jump", n: 1},
    {a: "Dead", n: 1},
    {a: "Choque", n: 1}
];
const ESCALA = .5;

/*****************
 OBJETOS
 ******************/

function Mango(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w * 10;
    game.nivel3.imagenMango = new Image();
    game.nivel3.imagenMango.src = "objetos/mango.png";
    this.disparar = function () {
        game.ctx.save();
        game.ctx.drawImage(game.nivel3.imagenMango, this.x, this.y, this.w, this.w);
        this.y = this.y + 6;
        game.ctx.restore();
    };
}

function Objeto(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w * 10;
    game.nivel3.imagenObjeto = new Image();
    game.nivel3.imagenObjeto.src = "objetos/roca.png";
    this.disparar = function () {
        game.ctx.save();
        game.ctx.drawImage(game.nivel3.imagenObjeto, this.x, this.y, this.w, this.w);
        this.y = this.y + 6;
        game.ctx.restore();
    };
}

function Jugador(x) {
    this.x = x;
    this.w = 120;
    this.h = 100;
    this.y = game.canvas.height - this.h;
    this.dibujar = function (x) {
        this.x = x;
        game.ctx.drawImage(game.nivel3.imagenJugador, this.x, this.y, this.w, this.h);
    };
}

function Enemigo(x, y) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.figura = true;
    this.vive = true;
}

function dibujaFrames() {
    if (game.intro) {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.drawImage(game.introFrame[game.frameIndex], 0, 0, game.canvas.width, game.canvas.height);
        game.frameIndex = (game.frameIndex + 1) % game.introFrame.length;
    } else if (game.gameOver) {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.drawImage(game.gameOverFrame[game.frameIndex], 0, 0, game.canvas.width, game.canvas.height);
        game.frameIndex = (game.frameIndex + 1) % game.gameOverFrame.length;
    } else if (game.win) {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.drawImage(game.winFrame[game.frameIndex], 0, 0, game.canvas.width, game.canvas.height);
        game.frameIndex = (game.frameIndex + 1) % game.winFrame.length;
    } else if (game.levelUp) {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.drawImage(game.levelUpFrame[game.frameIndex], 0, 0, game.canvas.width, game.canvas.height);
        game.frameIndex = (game.frameIndex + 1) % game.levelUpFrame.length;
    } else {
        //  console.log("no hay nada que mostrar")
    }
}

function cargarFrames() {
    gameOver();
    levelUp();
    intro();
    win();
}

function cargarAcciones() {
    for (var i = 0; i < ACCION.length; i++) {
        for (var j = 0; j < ACCION[i].n; j++) {
            game.nivel1.carro.push({
                a: ACCION[i].a,
                c: j + 1,
                s: null
            });
        }
    }
}

function existe(accion, cuadro) {
    for (var i = 0; i < game.nivel1.carro.length; i++) {
        if (game.nivel1.carro[i].a == accion &&
            game.nivel1.carro[i].c == cuadro) {
            return i;
        }
    }
    return -1;
}

function generaObjeto() {
    objeto = true;
    objetox = game.canvas.width;
    game.nivel1.objeto1 = new Image();
    let i = Math.floor(Math.random() * game.nivel1.objetos_array.length)
    game.nivel1.objeto1.src = "objetos/" + game.nivel1.objetos_array[i];
    let j = Math.floor(Math.random() * game.nivel1.objetos_pocision_array.length)
    game.nivel1.posicion = game.nivel1.objetos_pocision_array[j];
    game.nivel1.cantidadObjeto++;
}

function dibujarCarro() {
    let index = existe(game.nivel1.movimiento, game.nivel1.cuadro);
    // if (index > 0) {
    if (game.nivel1.carro[index].s == null) {
        let sprite = new Image();

        sprite.src = "redhatfiles/png/" + game.nivel1.movimiento + " (" + game.nivel1.cuadro + ").png";
        sprite.onload = function () {
            game.ctx.drawImage(sprite, game.nivel1.posicionCarro, 450,
                sprite.width * ESCALA, sprite.height * ESCALA);
            if (game.nivel1.movimiento === "Dead") {
                // gameOver = true;
            }
            game.nivel1.carro[index].s = sprite;
            game.nivel1.anchoCarro = sprite.width;
            game.nivel1.altoCarro = sprite.height;
        }

    } else {
        game.ctx.drawImage(game.nivel1.carro[index].s, game.nivel1.posicionCarro, 450,
            game.nivel1.anchoCarro * ESCALA, game.nivel1.altoCarro * ESCALA);
    }
    game.nivel1.cuadro++;
    if (game.nivel1.cuadro > game.nivel1.numeroDeFrames) {
        game.nivel1.cuadro = 1;
    }
    // }
}


function cargarMain() {

    cargarFrames();
    cargarAcciones();
    console.log("cargar main")
    game.canvas = document.getElementById("canvas");
    if (game.canvas && game.canvas.getContext) {
        game.ctx = game.canvas.getContext("2d");
        setInterval(dibujaFrames, 150);
        if (game.ctx) {
            if (game.intro) {
                game.canvas.addEventListener('click', function (event) {
                    if (!game.start) {
                        inicio();
                    }
                });
            } else {
                alert("NO cuentas con CANVAS")
            }
        }
    }
}

/***********
 FUNCIONES
 ************/
const win = () => {
    for (let i = 1; i <= 60; i++) {
        game.imagenWin = new Image();
        game.imagenWin.src = `imagenes/win (${i}).png`;
        game.winFrame.push(game.imagenWin);
    }
}
const gameOver = () => {
    for (let i = 1; i <= 37; i++) {
        game.imagenGameOver = new Image();
        game.imagenGameOver.src = `imagenes/gameOver (${i}).png`;
        game.gameOverFrame.push(game.imagenGameOver);
    }
}
const intro = () => {
    for (let i = 1; i <= 6; i++) {
        game.imagenIntro = new Image();
        game.imagenIntro.src = `imagenes/intro (${i}).png`;
        game.introFrame.push(game.imagenIntro);
    }
}
const levelUp = () => {
    for (let i = 1; i <= 154; i++) {
        game.imagenLevelUp = new Image();
        game.imagenLevelUp.src = `imagenes/levelUp (${i}).png`;
        game.levelUpFrame.push(game.imagenLevelUp);
    }
}

const inicio = () => {
    game.start = true;
    if (game.gameOver || game.win ) {
        window.location.reload();
    }
    game.intro = false;
    game.gameOver = false;
    game.win = false;
    game.levelUp = false;
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    if (game.nivel1.estado) {
        iniciarNivel1();
    } else if (game.nivel2.estado) {
        iniciarNivel2();
    } else if (game.nivel3.estado) {
        iniciarNivel3();
    }
}

const iniciarNivel1 = () => {
    inicioNivel1();
    game.nivel1.estado = true;
    game.nivel2.estado = false;
    game.nivel3.estado = false;
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    animar();

}
const iniciarNivel2 = () => {
    game.nivel1.estado = false;
    game.nivel2.estado = true;
    game.nivel3.estado = false;
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    animar();
}
const iniciarNivel3 = () => {
    inicioNivel3();
    game.nivel1.estado = false;
    game.nivel2.estado = false;
    game.nivel3.estado = true;
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.jugador = new Jugador(0);
    game.x = game.canvas.width / 2;
    game.jugador.dibujar(game.x);
    animar();
}
const animar = () => {
    if (game.finJuego == false) {

        if (game.nivel1.estado) {
            verificarNivel1();
            colisionCarro();
            game.nivel1.puntos += 1;
            score();
            requestAnimationFrame(animar);
            // dibujarCarro();
            // cargarFondo();
        } else if (game.nivel2.estado) {
        } else if (game.nivel3.estado) {
            verificarNivel3();
            pintar();
            colisionesMango();
            colisionesObjetos();
            requestAnimationFrame(animar);
        }
    }
}
const colisionCarro = () => {
    if (game.nivel1.posicionCarro == game.nivel1.posicion && (game.nivel1.altura > 420 && game.nivel1.altura < 480)) {
        game.nivel1.arregloColisiones.push(game.nivel1.cantidadObjeto);
        game.nivel1.movimiento = ACCION[6].a;
        const arraySinDuplicados = [...new Set(game.nivel1.arregloColisiones)];
        game.menosVidas = arraySinDuplicados.length;
        if (arraySinDuplicados.length == game.vidas) {
            game.nivel1.movimiento = ACCION[5].a;
            game.finJuego = true;
            game.nivel1.estado = false;
            game.nivel1.finNivel = true;
            game.gameOver = true;
            game.start = false;
        }
    }
}
const colisionesMango = () => {
    let bala;
    for (var j = 0; j < game.nivel3.mango_array.length; j++) {
        bala = game.nivel3.mango_array[j];
        if (bala != null) {
            if ((bala.x > game.jugador.x) && (bala.x < game.jugador.x + game.jugador.w) && (bala.y > game.jugador.y) && (bala.y < game.jugador.y + game.jugador.h)) {
                game.nivel3.coleccion_mango.push(game.nivel3.colision_mango[game.nivel3.contador_mangos - 1]);
            }
        }
    }
}
const colisionesObjetos = () => {
    let bala;
    for (var j = 0; j < game.nivel3.objeto_array.length; j++) {
        bala = game.nivel3.objeto_array[j];
        if (bala != null) {
            if ((bala.x > game.jugador.x) && (bala.x < game.jugador.x + game.jugador.w) && (bala.y > game.jugador.y) && (bala.y < game.jugador.y + game.jugador.h)) {
                game.nivel3.coleccion_objeto.push(game.nivel3.colision_objeto[game.nivel3.contador_objetos - 1]);
            }
        }
    }
}
const verificarNivel1 = () => {
    if (game.tecla[KEY_LEFT]) {
        game.nivel1.teclaNumero = Number(1);
        game.nivel1.posicionCarro = game.nivel1.objetos_pocision_array[0];
    } else if (game.tecla[KEY_RIGHT]) {
        game.nivel1.teclaNumero = Number(3);
        game.nivel1.posicionCarro = game.nivel1.objetos_pocision_array[1];
    }
    if (game.nivel1.contadorTotal === 15) {
        game.nivel1.estado = false;
        game.levelUp = true;

        game.nivel3.estado = true;//axalpusa nivel 2
        game.start = false;
    }

}
const verificarNivel3 = () => {
    let listaSinDuplicadosMango = [...new Set(game.nivel3.coleccion_mango)];
    let listaSinDuplicadosObjetos = [...new Set(game.nivel3.coleccion_objeto)];
    game.menosVidas = listaSinDuplicadosObjetos.length;
    game.nivel3.puntos = listaSinDuplicadosMango.length;
    if (game.tecla[KEY_RIGHT]) game.x += 10;
    if (game.tecla[KEY_LEFT]) game.x -= 10;
    if (game.x > game.canvas.width - 10) game.x = game.canvas.width - 10;
    if (game.x < 0) game.x = 10;
    if (Math.random() > 0.99) caidaMango();
    if (Math.random() > 0.99) caidaObjeto();
    if (game.vidas <= game.menosVidas) {
        game.finJuego = true;
        game.nivel3.finNivel = true;
        game.gameOver = true;
        game.start = false;
    }
    if (game.nivel3.puntos >= 5) {//axalpusa 20
        game.finJuego = true;
        game.nivel3.finNivel = true;
        game.win = true;
        game.start = false;
    }
}

const caidaObjeto = () => {
    game.nivel3.contador_objetos++;
    game.nivel3.colision_objeto.push(game.nivel3.contador_objetos);
    var ultimos = new Array();
    for (var i = game.nivel3.enemigos_array.length - 1; i > 0; i--) {
        if (game.nivel3.enemigos_array[i] != null) {
            ultimos.push(i);
        }
        if (ultimos.length == 20) break;
    }
    d = ultimos[Math.floor(Math.random() * 20)];
    game.nivel3.objeto_array.push(new Objeto(game.nivel3.enemigos_array[d].x + game.nivel3.enemigos_array[d].w / 2, game.nivel3.enemigos_array[d].y, 5));
}

const caidaMango = () => {
    game.nivel3.contador_mangos++;
    game.nivel3.colision_mango.push(game.nivel3.contador_mangos);
    var ultimos = new Array();
    for (var i = game.nivel3.enemigos_array.length - 1; i > 0; i--) {
        if (game.nivel3.enemigos_array[i] != null) {
            ultimos.push(i);
        }
        if (ultimos.length == 20) break;
    }
    d = ultimos[Math.floor(Math.random() * 20)];
    game.nivel3.mango_array.push(new Mango(game.nivel3.enemigos_array[d].x + game.nivel3.enemigos_array[d].w / 2, game.nivel3.enemigos_array[d].y, 5));
}
const pintar = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.jugador.dibujar(game.x);
    pintarMango();
    pintarObjeto();
    score();
}
const pintarMango = () => {
    for (var i = 0; i < game.nivel3.mango_array.length; i++) {
        if (game.nivel3.mango_array[i] != null) {
            game.nivel3.mango_array[i].disparar();
            if (game.nivel3.mango_array[i].y > game.canvas.height) game.nivel3.mango_array[i] = null;
        }
    }
}
const pintarObjeto = () => {
    for (var i = 0; i < game.nivel3.objeto_array.length; i++) {
        if (game.nivel3.objeto_array[i] != null) {
            game.nivel3.objeto_array[i].disparar();
            if (game.nivel3.objeto_array[i].y > game.canvas.height) game.nivel3.objeto_array[i] = null;
        }
    }
}
const score = () => {
    if (game.nivel1.estado) {
        game.ctx.fillStyle = "red";
        game.ctx.font = "bold 20px Courier";
        game.ctx.fillText("PUNTOS: " + game.nivel1.puntos, 10, 20);
        game.ctx.restore();
    }
    if (game.nivel3.estado) {
        game.ctx.fillStyle = "red";
        game.ctx.font = "bold 20px Courier";
        game.ctx.fillText("PUNTOS: " + game.nivel3.puntos, 10, 20);
        game.ctx.restore();
    }

    game.ctx.fillStyle = "red";
    game.ctx.font = "bold 20px Courier";
    game.ctx.fillText("VIDAS: " + (game.vidas - game.menosVidas), 400, 20);
    game.ctx.restore();
}
const inicioNivel1 = () => {
    game.nivel1.imagenFondo = new Image();
    game.nivel1.imagenFondo.src = "imagenes/carretera.png";
    game.nivel1.imagenFondo.onload = function () {
        game.nivel1.numeroDeFrames = ACCION[game.nivel1.teclaNumero].n;
        game.nivel1.movimiento = ACCION[game.nivel1.teclaNumero].a;
        generaObjeto();
        objeto = true;
        game.nivel1.inicioY = game.nivel1.imagenFondo.height;
        setInterval(function () {
            game.nivel1.dy = game.nivel1.dy + 1;
            game.nivel1.contadorTotal++;
        }, 500); //28000 axalpusa
        setInterval(function () {
            if (game.nivel1.estado) {
                game.nivel1.inicioY -= game.nivel1.dy;
                game.nivel1.altura += game.nivel1.dy;
                game.ctx.drawImage(game.nivel1.imagenFondo,
                    0, game.nivel1.inicioY, game.nivel1.imagenFondo.width, game.nivel1.altura,
                    0, 0, game.nivel1.imagenFondo.width, game.nivel1.altura);
                game.ctx.drawImage(game.nivel1.imagenFondo,
                    0, 0, game.nivel1.imagenFondo.width, game.nivel1.imagenFondo.height - game.nivel1.altura,
                    0, game.nivel1.imagenFondo.height - game.nivel1.inicioY, game.nivel1.imagenFondo.width, game.nivel1.imagenFondo.height - game.nivel1.altura);
                if (game.nivel1.altura >= game.nivel1.imagenFondo.height) {
                    game.nivel1.inicioY = game.nivel1.imagenFondo.height;
                    game.nivel1.altura = 0;
                    generaObjeto();
                }
                if (objeto) {
                    game.ctx.drawImage(game.nivel1.objeto1,
                        0, 0, game.nivel1.imagenFondo.width, game.nivel1.imagenFondo.height - game.nivel1.altura,
                        game.nivel1.posicion, game.nivel1.imagenFondo.height - game.nivel1.inicioY, game.nivel1.imagenFondo.width, game.nivel1.imagenFondo.height - game.nivel1.altura);
                }
                game.nivel1.movimiento = ACCION[game.nivel1.teclaNumero].a;
                game.nivel1.numeroDeFrames = ACCION[game.nivel1.teclaNumero].n;
                dibujarCarro();
            }

        }, 1000 / 60);

    }
}
const inicioNivel3 = () => {
    game.nivel3.imagenJugador = new Image();
    game.nivel3.imagenJugador.src = "objetos/jugador.png";
    game.nivel3.imagenEnemigo = new Image();
    game.nivel3.imagenEnemigo.src = "objetos/mango.png";
    game.nivel3.imagenEnemigo.onload = function () {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 20; j++) {
                game.nivel3.enemigos_array.push(new Enemigo(100 + 40 * j, 35 + 45 * i));
            }
        }
    }
}
/*************
 LISTENER
 **************/

document.addEventListener("keydown", function (e) {
    game.teclaPulsada = e.keyCode;
    game.tecla[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
    game.tecla[e.keyCode] = false;
});

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTomiout(callback, 17);
    }
})();

window.onload = function () {
    cargarMain();
}