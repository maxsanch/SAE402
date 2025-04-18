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
const audioVibration = document.querySelector("#vibration");
const audioElementObstacle = document.querySelector("#audio_obstacle");
const audioElementNote = document.querySelector("#audio_note");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sourceObstacle = audioContext.createMediaElementSource(audioElementObstacle);
const sourceNote = audioContext.createMediaElementSource(audioElementNote);
const pannerObstacle = audioContext.createStereoPanner();
const pannerNote = audioContext.createStereoPanner();
let Jeu_en_cours = false;
let partition_ecriture = {};

// Connexion des nodes audio
sourceObstacle.connect(pannerObstacle);
pannerObstacle.connect(audioContext.destination);

sourceNote.connect(pannerNote);
pannerNote.connect(audioContext.destination);

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
        timeur: 5,
        etat: "obstacle",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 1500,
        etat: "note",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 4500,
        etat: "note",
        numero: 1,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 2000,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 2500,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 3000,
        etat: "obstacle",
        numero: 2,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 3500,
        etat: "obstacle",
        numero: 3,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 4000,
        etat: "obstacle",
        numero: 3,
        vY: 0,
        Y: -150,
        X: 0,
        toucher: false,
        position_partition: 0
    },
    {
        timeur: 4500,
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
    if (Jeu_en_cours == true) {
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


            // document.querySelector(".position").innerHTML = "position : " + charactéristique.Y;

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
            if (charactéristique.Y >= 0 && charactéristique.Y <= H - 60) {
                if (charactéristique.etat === "obstacle" && audioElementObstacle.paused) {
                    setAudioPan(charactéristique.position_partition, pannerObstacle);
                    audioElementObstacle.play();
                    audioElementObstacle.volume = (charactéristique.Y / H);
                }
                if (charactéristique.etat === "note" && audioElementNote.paused) {
                    setAudioPan(charactéristique.position_partition, pannerNote);
                    audioElementNote.play();
                    audioElementNote.volume = (charactéristique.Y / H);
                }
            }

            if (charactéristique.Y >= H - 60 && charactéristique.Y <= H - 40 && xBille == charactéristique.X && charactéristique.toucher == false) {
                // console.log("toucher")
                if (charactéristique.etat == "note") {
                    charactéristique.toucher = true;
                    document.querySelector(".ecran_rouge").classList.add("vert");
                    setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("vert") }, 150);
                    score++;
                    if ('vibrate' in navigator) {
                        // Déclencher la vibration pendant 2 secondes
                        navigator.vibrate(2000);
                    }
                    else {
                        audioElementNote.pause();
                        audioElementObstacle.pause();
                        audioVibration.play();
                    }
                    console.log("gfdgdfgdf")
                }
                if (charactéristique.etat == "obstacle") {
                    charactéristique.toucher = true;
                    document.querySelector(".ecran_rouge").classList.add("rouge");
                    setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("rouge") }, 150);
                    score = score - 0.5;
                    if ('vibrate' in navigator) {
                        // Déclencher la vibration pendant 1 secondes
                        navigator.vibrate(1000);
                    }
                    else {
                        audioElementNote.pause();
                        audioElementObstacle.pause();
                        audioVibration.play();
                    }
                    console.log("trerteter")
                }
            }
        })
        // console.log(score)
        temps_avant = temps;
    }
}

function boucle() {
    if (Jeu_en_cours == true) {
        calcul();
        afficher();
        window.requestAnimationFrame(boucle);
    }
    else {
        window.cancelAnimationFrame(boucle);
    }
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

// if (Jeu_en_cours == true) {
//     boucle();
//     chrono_incrementage();
// }


function chrono_incrementage() {
    chrono++;
    if (Jeu_en_cours == true) {
        window.setTimeout(chrono_incrementage, 1);
    }

    // document.querySelector(".temps").innerHTML = "chrono : " + chrono;


    Object.entries(partition).forEach(([numero_entité, charactéristique]) => {
        if (chrono == charactéristique.timeur) {
            partition_ecran.push(charactéristique);
        }
    })

    if (chrono == 5000) {
        Arreter_jeu();
    }

}

document.querySelector(".lancer_jeu").addEventListener("click", lancement_du_jeu)

function lancement_du_jeu() {
    W = window.innerWidth;
    H = window.innerHeight;
    lockOrientation();
    document.querySelector(".score").classList.add("score_present");
    document.querySelector(".lancement").style = "display: none;";
    Jeu_en_cours = true;
    boucle();
    chrono_incrementage();
}

// Fonction pour définir la balance du son
function setAudioPan(position_partition, panner) {
    if (position_partition === 1) {
        panner.pan.value = -1; // Gauche
    } else if (position_partition === 3) {
        panner.pan.value = 1;  // Droite
    } else {
        panner.pan.value = 0;  // Centré (les deux oreilles)
    }
}

screen.orientation.addEventListener("change", (event) => {
    const type = event.target.type;
    const angle = event.target.angle;
    // document.querySelector(".orientation").innerHTML = "type : " + type + " et angle : " + angle;
    console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
    if (type.includes("portrait")) {
        Jeu_en_cours = true;
        boucle();
        chrono_incrementage();
    }
    else {
        Arreter_jeu();
    }
});


function lockOrientation() {
    const elem = document.documentElement; // tu peux aussi cibler un élément précis

    if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('portrait').catch((error) => {
                    console.error('Erreur lors du verrouillage de l\'orientation :', error);
                });
            }
        });
    }
}

function Arreter_jeu() {
    document.querySelector(".score").classList.remove("score_present");
    Jeu_en_cours = false;
    ctx_notes.clearRect(0, 0, W, H);
    ctx_obstacles.clearRect(0, 0, W, H);
    ctx_personnage.clearRect(0, 0, W, H);
}
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