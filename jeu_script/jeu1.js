var canvas_personnage = document.querySelector("#canvas_personnage")
var ctx_personnage = canvas_personnage.getContext("2d");
var canvas_notes = document.querySelector("#canvas_notes")
var ctx_notes = canvas_notes.getContext("2d");
var vX = 0;
var vY = 0;
var xNotes = 0;
let position_note = 0;

var gravite = 0.01;

canvas_personnage.height = window.innerHeight;
canvas_personnage.width = window.innerWidth;
canvas_notes.height = window.innerHeight;
canvas_notes.width = window.innerWidth;
let W = window.innerWidth;
let H = window.innerHeight;

var yBille = -50;
var xBille = W / 2;

function afficher() {
    ctx_personnage.fillStyle = "pink";
    ctx_personnage.fillRect(0, 0, W, H);

    ctx_personnage.fillStyle = "purple";
    ctx_personnage.fillRect((W * 0.25) - 20, 0, 20, H)
    ctx_personnage.fillRect((W * 0.5) - 10, 0, 20, H)
    ctx_personnage.fillRect(W * 0.75, 0, 20, H)

    ctx_personnage.fillStyle = "yellow";
    ctx_personnage.fillRect(0, yBille, 20, 20)

    ctx_personnage.fillStyle = "black";
    ctx_personnage.fillRect(xBille, H - 50, 20, 20)

    ctx_notes.clearRect(0, 0, W, H)
    ctx_notes.fillStyle = "blue";
    ctx_notes.fillRect(xNotes, yBille, 20, 20)
}

function calcul() {
    accelerationY = gravite;
    vY += accelerationY;
    yBille += vY;
    if (yBille >= H + 50) {
        vY = 0
        yBille = H - 50
    }

    if (yBille >= H - 60 && yBille <= H - 40 && xBille == xNotes) {
        document.querySelector("div").style = "display: block;";
    }
    if (yBille <= H - 60 || yBille >= H - 40 || xBille != xNotes) {
        document.querySelector("div").style = "display: none;";
    }

    if (yBille <= 0 || yBille >= H) {
        position_note = (Math.random() * 3);
    }

    if (position_note < 1) {
        xNotes = (W * 0.25) - 20;
    }
    if (position_note < 2 && position_note >= 1) {
        xNotes = (W * 0.5) - 10;
    }
    if (position_note < 3 && position_note >= 2) {
        xNotes = W * 0.75;
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
    if (gamma >= 25) {
        xBille = W * 0.75;
    }
    if (gamma <= -25) {
        xBille = (W * 0.25) - 20;
    }
    if (gamma <= 25 && gamma >= -25) {
        xBille = (W * 0.5) - 10;
    }
}

boucle();