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
const audioMusique = document.querySelector("#musique");
const audioElementObstacle = document.querySelector("#audio_obstacle");
const audioElementNote = document.querySelector("#audio_note");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sourceObstacle = audioContext.createMediaElementSource(audioElementObstacle);
const sourceNote = audioContext.createMediaElementSource(audioElementNote);
const pannerObstacle = audioContext.createStereoPanner();
const pannerNote = audioContext.createStereoPanner();
let Jeu_en_cours = false;
let partition_ecriture = {};
var note_verte = document.querySelector(".note_verte")
var homme = document.querySelector(".homme")
var chaise = document.querySelector(".chaise")
var guitariste = document.querySelector(".guitariste")
let cheat = document.querySelector(".cheatcode").value
let gagner = false;
let chronotop = 0;
let chronobot = 0;

// Connexion des nodes audio
sourceObstacle.connect(pannerObstacle);
pannerObstacle.connect(audioContext.destination);

sourceNote.connect(pannerNote);
pannerNote.connect(audioContext.destination);

let partition_ecran = [];
let partition = [];

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
    // ctx_personnage.fillStyle = "pink";
    // ctx_personnage.fillRect(0, 0, W, H);

    ctx_personnage.clearRect(0, 0, W, H)
    ctx_personnage.fillStyle = "purple";
    ctx_personnage.fillRect((W * 0.25) - 20, 0, 20, H)
    ctx_personnage.fillRect((W * 0.5) - 10, 0, 20, H)
    ctx_personnage.fillRect(W * 0.75, 0, 20, H)

    ctx_personnage.fillStyle = "black";
    ctx_personnage.drawImage(guitariste, xBille, H - 130, 100, 100);
    // ctx_personnage.fillRect(xBille, H - 130, 100, 100)

    ctx_notes.clearRect(0, 0, W, H)

    Object.entries(partition_ecran).forEach(([numero_entité, charactéristique]) => {

        if (charactéristique.etat == "note") {
            ctx_notes.fillStyle = "red";
            ctx_notes.drawImage(note_verte, charactéristique.X, charactéristique.Y, 100, 100)
        }
        if (charactéristique.etat == "obstacle") {
            ctx_notes.fillStyle = "green";
            switch (charactéristique.type) {
                case "homme":
                    ctx_notes.drawImage(homme, charactéristique.X, charactéristique.Y, 100, 100);
                    break;
                case "chaise":
                    ctx_notes.drawImage(chaise, charactéristique.X, charactéristique.Y, 100, 100);
                    break;
                default:
                    ctx_notes.drawImage(note_verte, charactéristique.X, charactéristique.Y, 100, 100);
            }

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
                charactéristique.X = (W * 0.25) - 60;
            }
            if (charactéristique.position_partition == 2) {
                charactéristique.X = (W * 0.5) - 50;
            }
            if (charactéristique.position_partition == 3) {
                charactéristique.X = W * 0.75 - 40;
            }

            // console.log(charactéristique.toucher)
            if (charactéristique.Y >= 0 && charactéristique.Y <= H - 150) {
                if (charactéristique.etat === "obstacle" && audioElementObstacle.paused) {
                    setAudioPan(charactéristique.position_partition, pannerObstacle);
                    audioElementObstacle.play();
                }
                if (charactéristique.etat === "note" && audioElementNote.paused) {
                    setAudioPan(charactéristique.position_partition, pannerNote);
                    audioElementNote.play();
                }
                audioElementObstacle.volume = (charactéristique.Y / H);
                audioElementNote.volume = (charactéristique.Y / H);
            }
            if (charactéristique.Y >= H - 80) {
                if (charactéristique.etat === "obstacle" && audioElementObstacle.play) {
                    audioElementObstacle.pause();
                    audioElementObstacle.currentTime = 0;
                }
                if (charactéristique.etat === "note" && audioElementNote.paused) {
                    audioElementNote.pause();
                    audioElementNote.currentTime = 0;
                }
            }


            // console.log(charactéristique.Y + "        " + (H - 50))

            if (charactéristique.Y >= H - 180 && charactéristique.Y <= H - 80 && xBille == charactéristique.X && charactéristique.toucher == false) {
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
                    // console.log("trerteter")
                }
            }


            // if (charactéristique.Y = 0) {
            //     chronotop = chrono;
            // }


            // if (charactéristique.Y = H) {
            //     chronobot = chrono;
            // }

            //    console.log((chronobot - chronotop)) 
            
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
        xBille = (W * 0.75) - 40;
    }
    if (gamma <= -20) {
        xBille = (W * 0.25) - 60;
    }
    if (gamma <= 20 && gamma >= -20) {
        xBille = (W * 0.5) - 50;
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

    // if (chrono == 5000) {
    if (audioMusique.paused) {
        audioMusique.currentTime = 0;
        if (score >= 0) {
            gagner = true;
        }
        Arreter_jeu();
    }

}

document.querySelector(".lancer_jeu").addEventListener("click", lancement_du_jeu)

function lancement_du_jeu() {
    document.querySelector(".fond_jeu").classList.add("apparition");
    audioMusique.play()
    audioMusique.volume = 0.5
    chargement_des_notes();
    lockOrientation();
    document.querySelector(".score").classList.add("score_present");
    document.querySelector(".lancement").style = "display: none;";
    Jeu_en_cours = true;
    boucle();
    chrono_incrementage();
}

window.addEventListener("resize", RedimentionPage);

function RedimentionPage() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas_personnage.height = window.innerHeight;
    canvas_personnage.width = window.innerWidth;
    canvas_notes.height = window.innerHeight;
    canvas_notes.width = window.innerWidth;
    canvas_obstacles.height = window.innerHeight;
    canvas_obstacles.width = window.innerWidth;
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
    W = window.innerWidth;
    H = window.innerHeight;
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
    document.querySelector(".fond_jeu").classList.remove("apparition");
    partition = []
    document.querySelector(".score").classList.remove("score_present");
    if (gagner == true) {
        document.querySelector(".suite").classList.add("apparition");
    }
    else {
        document.querySelector(".fin>.cheatcode").classList.add("apparition");
    }
    Jeu_en_cours = false;
    ctx_notes.clearRect(0, 0, W, H);
    ctx_obstacles.clearRect(0, 0, W, H);
    ctx_personnage.clearRect(0, 0, W, H);
    document.querySelector(".fin").classList.add("apparition");
}

document.querySelector(".rejouer").addEventListener("click", rejouer)
document.querySelector(".suite").addEventListener("click", suite_du_jeu)
document.querySelector(".sombre").addEventListener("click", retour)
document.querySelector(".valider").addEventListener("click", lancer_cheat)
document.querySelectorAll('.cheatcode').forEach(e => {
    e.addEventListener("click", cheatcode)
})

function rejouer() {
    document.querySelector(".fond_jeu").classList.add("apparition");
    score = 0;
    chrono = 0;
    document.querySelector(".fin").classList.remove("apparition");
    document.querySelector(".fin>.cheatcode").classList.remove("apparition")
    chargement_des_notes();
    W = window.innerWidth;
    H = window.innerHeight;
    document.querySelector(".score").classList.add("score_present");
    document.querySelector(".lancement").style = "display: none;";
    Jeu_en_cours = true;
    audioMusique.play()
    boucle();
    chrono_incrementage();
}


function suite_du_jeu() {
    localStorage.setItem('progress', 'Jeu1');
    window.location.href = "../index.html"
}

function cheatcode() {
    document.querySelector(".cheat").classList.add("apparition")
    document.querySelector(".sombre").classList.add("apparition")
}

function retour() {
    document.querySelector(".cheat").classList.remove("apparition")
    document.querySelector(".sombre").classList.remove("apparition")
    document.querySelector(".mauvais_cheat").classList.remove("apparition")
}

function lancer_cheat() {
    if (document.querySelector(".cheatcode_mdp").value.toLowerCase() === "mmi") {
        suite_du_jeu();
    }
    else {
        document.querySelector(".mauvais_cheat").classList.add("apparition")
    }
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

function chargement_des_notes() {
    partition.push(
        // {
        //     timeur: 5,
        //     etat: "note",
        //     numero: 1,
        //     vY: 0,
        //     Y: -150,
        //     X: 0,
        //     toucher: false,
        //     position_partition: 0
        // },
        {
            timeur: 5,
            etat: "obstacle",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "chaise"
        },
        {
            timeur: 1500,
            etat: "note",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "homme"
        },
        {
            timeur: 4500,
            etat: "note",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "chaise"
        },
        {
            timeur: 2000,
            etat: "note",
            numero: 2,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "homme"
        },
        {
            timeur: 2500,
            etat: "obstacle",
            numero: 2,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "chaise"
        },
        {
            timeur: 3000,
            etat: "obstacle",
            numero: 2,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "homme"
        },
        {
            timeur: 3500,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "chaise"
        },
        {
            timeur: 4000,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "homme"
        },
        {
            timeur: 4500,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 0,
            type: "chaise"
        },)
}