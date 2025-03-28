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
    if (yBille >= H)
    {
        vY = 0
        yBille = H - 50
    }
}

function boucle() {
    calcul();
    afficher();
    window.requestAnimationFrame(boucle);
}

window.addEventListener("deviceorientation", Inclinaison_Du_Telephone, true);

function Inclinaison_Du_Telephone(event) {
    const gamma = event.gamma;
    document.querySelector(".gamma").innerText = "gamma : " + gamma;
    if (gamma >= 25) {
        xBille = W / 1.5;
    }
    if (gamma <= -25) {
        xBille = W / 4;
    }
    if (gamma <= 25 && gamma >= -25) {
        xBille = W / 2;
    }
}

boucle();