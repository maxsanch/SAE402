var canvas = document.querySelector("#canvas")
var ctx = canvas.getContext("2d");
var vX = 0;
var vY = 0;

var gravite = 0.01;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let W = window.innerWidth;
let H = window.innerHeight;

var yBille = 0;
var xBille = W / 2;

function afficher() {
    ctx.fillStyle = "pink";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "black";
    ctx.fillRect(xBille, yBille, 20, 20)
}

function calcul() {
    accelerationY = gravite;
    // accelerationX = gravite;
    vY += accelerationY;
    // vX += accelerationX;
    yBille += vY;
    // xBille += vX;
}

function boucle() {
    calcul();
    afficher();
    window.requestAnimationFrame(boucle);
}

window.addEventListener("deviceorientation", Inclinaison_Du_Telephone, true);

function Inclinaison_Du_Telephone(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    document.querySelector(".absolute").innerText = "absolute : " + absolute;
    document.querySelector(".alpha").innerText = "alpha : " + alpha;
    document.querySelector(".beta").innerText = "beta : " + beta;
    document.querySelector(".gamma").innerText = "gamma : " + gamma;
}

boucle();