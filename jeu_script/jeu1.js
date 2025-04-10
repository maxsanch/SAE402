var canvas_personnage = document.querySelector("#canvas_personnage");
var ctx_personnage = canvas_personnage.getContext("2d");
var canvas_notes = document.querySelector("#canvas_notes");
var ctx_notes = canvas_notes.getContext("2d");
var canvas_obstacles = document.querySelector("#canvas_obstacles");
var ctx_obstacles = canvas_obstacles.getContext("2d");
let score = 0;
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
        timeur: 5,
        etat: "note",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 500,
        etat: "note",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 500,
        etat: "note",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 450,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 450,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 450,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 550,
        etat: "obstacle",
        numero: 3,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 550,
        etat: "obstacle",
        numero: 3,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
    {
        timeur: 550,
        etat: "obstacle",
        numero: 3,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false, 
        position_partition: 0
    },
];

var gravite = 100;

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
    document.querySelector(".score").innerHTML = "Score : " + (score * 100) + "";
    ctx_personnage.fillStyle = "pink";
    ctx_personnage.fillRect(0, 0, W, H);

    ctx_personnage.fillStyle = "purple";
    ctx_personnage.fillRect((W * 0.25) - 20, 0, 20, H)
    ctx_personnage.fillRect((W * 0.5) - 10, 0, 20, H)
    ctx_personnage.fillRect(W * 0.75, 0, 20, H)

    ctx_personnage.fillStyle = "black";
    ctx_personnage.fillRect(xBille, H - 50, 20, 20)

    ctx_notes.clearRect(0, 0, W, H)

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
    temps_difference = (temps - temps_avant) / 1000;

    let position = [1, 2, 3];
    shuffle(position);


    Object.entries(partition_ecran).forEach(([numero_entité, charactéristique]) => {
        charactéristique.vY += gravite * temps_difference;
        charactéristique.Y += charactéristique.vY * temps_difference;

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

        // console.log(charactéristique.toucher)

        if (charactéristique.Y >= H - 60 && charactéristique.Y <= H - 40 && xBille == charactéristique.X && charactéristique.toucher == false) {
            // console.log("toucher")
            if (charactéristique.etat == "note") {
                charactéristique.toucher = true;
                document.querySelector(".ecran_rouge").classList.add("vert");
                setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("vert") }, 150);
                score++;
            }
            if (charactéristique.etat == "obstacle") {
                charactéristique.toucher = true;
                document.querySelector(".ecran_rouge").classList.add("rouge");
                setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("rouge") }, 150);
                score = score - 0.5;
            }
        }
    })
    console.log(score)
    temps_avant = temps;
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
    window.setTimeout(chrono_incrementage, 1);



    Object.entries(partition).forEach(([numero_entité, charactéristique]) => {
        if (chrono == charactéristique.timeur) {
            partition_ecran.push(charactéristique);
        }
    })
}

// screen.orientation.addEventListener("change", (event) => {
//     const type = event.target.type;
//     const angle = event.target.angle;
//     document.querySelector(".orientation").innerHTML = "type : " + type + " et angle : " + angle;
//     console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
//   });



//   // Lock button: Lock the screen to the other orientation (rotated by 90 degrees)
// const rotate_btn = document.querySelector("#lock_button");
// rotate_btn.addEventListener("click", () => {
//   log.textContent += `Lock pressed \n`;

//   const oppositeOrientation = screen.orientation.type.startsWith("portrait")
//     ? "landscape"
//     : "portrait";
//   screen.orientation
//     .lock(oppositeOrientation)
//     .then(() => {
//       log.textContent = `Locked to ${oppositeOrientation}\n`;
//     })
//     .catch((error) => {
//       log.textContent += `${error}\n`;
//     });
// });