var canvas_personnage = document.querySelector("#canvas_personnage");
var ctx_personnage = canvas_personnage.getContext("2d");
var canvas_notes = document.querySelector("#canvas_notes");
var ctx_notes = canvas_notes.getContext("2d");
var canvas_obstacles = document.querySelector("#canvas_obstacles");
var ctx_obstacles = canvas_obstacles.getContext("2d");
var vX = 0;
var vY = 0;
var xNotes = 0;
var xObstacles = 0;
let position_note = 0;
let position_obstacle = 0;
let chrono = 0
let temps = 0;
let temps_avant = 0;
let temps_difference = 0;
let partition_ecriture = {};

let partition_ecran = [];
let partition = [
    {
        timeur: 465,
        etat: "note",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        position_partition: 0
    },
    {
        timeur: 467,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        position_partition: 0
    },
    {
        timeur: 3500000000000000,
        etat: "obstacle",
        numero: 3,
        vY: 0,
        Y: -150,
        X: 0,
        position_partition: 0
    },
];

var gravite = 1;

canvas_personnage.height = window.innerHeight;
canvas_personnage.width = window.innerWidth;
canvas_notes.height = window.innerHeight;
canvas_notes.width = window.innerWidth;
canvas_obstacles.height = window.innerHeight;
canvas_obstacles.width = window.innerWidth;
let W = window.innerWidth;
let H = window.innerHeight;

var yNotes = -150;
var yObstacles = -150;
var xBille = W / 2;

function afficher() {
    ctx_personnage.fillStyle = "pink";
    ctx_personnage.fillRect(0, 0, W, H);

    ctx_personnage.fillStyle = "purple";
    ctx_personnage.fillRect((W * 0.25) - 20, 0, 20, H)
    ctx_personnage.fillRect((W * 0.5) - 10, 0, 20, H)
    ctx_personnage.fillRect(W * 0.75, 0, 20, H)

    ctx_obstacles.clearRect(0, 0, W, H)
    ctx_obstacles.fillStyle = "yellow";
    ctx_obstacles.fillRect(xObstacles, yObstacles, 20, 20)

    ctx_personnage.fillStyle = "black";
    ctx_personnage.fillRect(xBille, H - 50, 20, 20)

    ctx_notes.clearRect(0, 0, W, H)
    ctx_notes.fillStyle = "blue";
    ctx_notes.fillRect(xNotes, yNotes, 20, 20)

    Object.entries(partition_ecran).forEach(([numero_entité, charactéristique]) => {

        if (charactéristique.etat == "note") {
            ctx_notes.fillStyle = "red";
            ctx_notes.fillRect(charactéristique.X, charactéristique.Y, 20, 20)
        }
        if (charactéristique.etat == "obstacle") {
            ctx_notes.fillStyle = "green";
            ctx_notes.fillRect(charactéristique.X, charactéristique.Y, 20, 20)
        }
    })
}

function calcul() {
    temps = performance.now();
    temps_difference = temps - temps_avant;


    console.log(temps_difference);
    accelerationY = gravite / (temps_difference * 10);
    vY += accelerationY;
    // yNotes += vY;
    // yObstacles += vY;


    let position = [1, 2, 3];
    shuffle(position);


    Object.entries(partition_ecran).forEach(([numero_entité, charactéristique]) => {
        charactéristique.vY += accelerationY;
        charactéristique.Y += vY;

        if (charactéristique.Y >= H + 50) {
            partition_ecran.splice(0, 1);
        }



        if (charactéristique.Y <= -50 || charactéristique.Y >= H) {
            charactéristique.position_partition = position.pop();
        }


        if (charactéristique.position_partition == 1) {
            charactéristique.X = (W * 0.25) - 20;
        }
        if (charactéristique.position_partition == 2) {
            charactéristique.X = (W * 0.5) - 10;
        }
        if (charactéristique.position_partition == 3) {
            charactéristique.X = W * 0.75;
        }
    })




    // if (yNotes >= H + 50) {
    //     vY = 0
    //     yNotes = 0 - 50
    // }
    // if (yObstacles >= H + 50) {
    //     vY = 0
    //     yObstacles = 0 - 50
    // }



    // if (yNotes >= H - 60 && yNotes <= H - 40 && xBille == xNotes) {
    //     document.querySelector(".ecran_rouge").classList.add("vert");
    //     setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("vert") }, 150);
    // }

    // if (yObstacles >= H - 60 && yObstacles <= H - 40 && xBille == xObstacles) {
    //     document.querySelector(".ecran_rouge").classList.add("rouge");
    //     setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("rouge") }, 150);
    // }

    // let position = [1, 2, 3];
    // shuffle(position);

    // if (yNotes <= -50 || yNotes >= H) {
    //     position_note = position.pop();
    // }
    // if (yObstacles <= -50 || yObstacles >= H) {
    //     position_obstacle = position.pop();
    // }


    // if (position_note == 1) {
    //     xNotes = (W * 0.25) - 20;
    // }
    // if (position_note == 2) {
    //     xNotes = (W * 0.5) - 10;
    // }
    // if (position_note == 3) {
    //     xNotes = W * 0.75;
    // }

    // if (position_obstacle == 1) {
    //     xObstacles = (W * 0.25) - 20;
    // }
    // if (position_obstacle == 2) {
    //     xObstacles = (W * 0.5) - 10;
    // }
    // if (position_obstacle == 3) {
    //     xObstacles = W * 0.75;
    // }
    temps_avant = performance.now();
}

function boucle() {
    calcul();
    afficher();
    window.requestAnimationFrame(boucle);
}

window.addEventListener("deviceorientation", Inclinaison_Du_Telephone, true);

function Inclinaison_Du_Telephone(event) {
    const gamma = event.gamma;
    if (gamma >= 20) {
        xBille = W * 0.75;
    }
    if (gamma <= -20) {
        xBille = (W * 0.25) - 20;
    }
    if (gamma <= 20 && gamma >= -20) {
        xBille = (W * 0.5) - 10;
    }
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

boucle();
chrono_incrementage();

function chrono_incrementage() {
    chrono++;
    // console.log(chrono);
    window.setTimeout(chrono_incrementage, 1);



    Object.entries(partition).forEach(([numero_entité, charactéristique]) => {
        if (chrono == charactéristique.timeur) {
            partition_ecran.push(charactéristique);
            console.log("détection de " + numero_entité + " au timeur " + chrono);
        }
    })





    // console.log(partition_ecran)

}