// //////////////////////////////////////////////////////////////////// //
// Toutes les variables que j'initialise qui seront utilisées plus tard //
// //////////////////////////////////////////////////////////////////// //

var canvas_personnage = document.querySelector("#canvas_personnage");
var ctx_personnage = canvas_personnage.getContext("2d");
var canvas_notes = document.querySelector("#canvas_notes");
var ctx_notes = canvas_notes.getContext("2d");
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
var note_verte = document.querySelector(".note_verte");
var homme = document.querySelector(".homme");
var chaise = document.querySelector(".chaise");
var guitariste = document.querySelector(".guitariste");
let cheat = document.querySelector(".cheatcode").value;
let gagner = false;
let tuto_video = document.querySelector(".tuto_video");
let chronotop = 0;
let chronobot = 0;
let paused = false;
let partition_ecran = [];
let partition = [];
var gravite = 100;
let pause_en_cours = false;

// ///////////////////////// //
// Connexion des nodes audio //
// ///////////////////////// //
sourceObstacle.connect(pannerObstacle);
pannerObstacle.connect(audioContext.destination);

sourceNote.connect(pannerNote);
pannerNote.connect(audioContext.destination);

// ////////////////////////////////////// //
// Initialisation de la taille des canvas //
// ////////////////////////////////////// //
canvas_personnage.height = window.innerHeight;
canvas_personnage.width = window.innerWidth;
canvas_notes.height = window.innerHeight;
canvas_notes.width = window.innerWidth;
let W = window.innerWidth;
let H = window.innerHeight;

var xBille = W / 2;


// //////////////////////////////////////////////////////////// //
// On affiche au bon endroit les différents éléments de la page //
// //////////////////////////////////////////////////////////// //
function afficher() {
    document.querySelector(".score").innerHTML = "Score : " + (score * 100) + "";

    ctx_personnage.clearRect(0, 0, W, H)
    ctx_personnage.fillStyle = "purple";
    ctx_personnage.fillRect((W * 0.25) - 20, 0, 20, H)
    ctx_personnage.fillRect((W * 0.5) - 10, 0, 20, H)
    ctx_personnage.fillRect(W * 0.75, 0, 20, H)

    ctx_personnage.fillStyle = "black";
    ctx_personnage.drawImage(guitariste, xBille, H - 130, 100, 100);

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

// ////////////////////////////////////////////////////// //
// On calcul la position de tout les éléments de la pages //
// ////////////////////////////////////////////////////// //
function calcul() {
    if (Jeu_en_cours == true) {
        temps = performance.now();
        temps_difference = (temps - temps_avant) / 1000;

        let position = [1, 2, 3];
        shuffle(position);

        Object.entries(partition_ecran).forEach(([numero_entité, charactéristique]) => {
            charactéristique.vY += gravite * temps_difference;
            charactéristique.Y += charactéristique.vY * temps_difference;

            // On supprime les éléments du tableau si l'élément sort de la page
            if (charactéristique.Y >= H + 50) {
                partition_ecran.splice(0, 1);
            }

            // On donne un chiffre aléatoire pour détérminer sur quel colonne l'élément sera
            if (charactéristique.Y <= -100 || charactéristique.Y >= H) {
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

            // On joue une musique en fonction de l'élément qui arrive
            if (charactéristique.Y >= 0 && charactéristique.Y <= H - 150) {
                if (charactéristique.etat === "obstacle" && audioElementObstacle.paused) {
                    setAudioPan(charactéristique.position_partition, pannerObstacle);
                    audioElementObstacle.play();
                }
                if (charactéristique.etat === "note" && audioElementNote.paused) {
                    setAudioPan(charactéristique.position_partition, pannerNote);
                    audioElementNote.play();
                }
                audioElementObstacle.volume = ((charactéristique.Y / H) / 2);
                audioElementNote.volume = (charactéristique.Y / H);
            }

            // On coupe le son si l'élément est trop basse
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

            // Collision avec les notes et obstacles de la page
            if (charactéristique.Y >= H - 180 && charactéristique.Y <= H - 80 && xBille == charactéristique.X && charactéristique.toucher == false) {
                if (charactéristique.etat == "note") {
                    charactéristique.toucher = true;
                    document.querySelector(".ecran_rouge").classList.add("vert");
                    setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("vert") }, 150);
                    score++;
                    if ('vibrate' in navigator) {
                        navigator.vibrate(200);
                    }
                    else {
                        audioElementNote.pause();
                        audioElementObstacle.pause();
                        audioVibration.play();
                    }
                }
                if (charactéristique.etat == "obstacle") {
                    charactéristique.toucher = true;
                    document.querySelector(".ecran_rouge").classList.add("rouge");
                    setTimeout(() => { document.querySelector(".ecran_rouge").classList.remove("rouge") }, 150);
                    score = score - 0.5;
                    if ('vibrate' in navigator) {
                        navigator.vibrate(200);
                    }
                    else {
                        audioElementNote.pause();
                        audioElementObstacle.pause();
                        audioVibration.play();
                    }
                }
            }
        })
        temps_avant = temps;
    }
}

// Boucle d'affichage de ce qu'il y a sur la page
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

// On récupère l'inclinaison du téléphone pour bouger le personnage
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

// Randomisation de l'ordre des éléments du tableau pour que les éléments arrivent sur une colonnes aléatoires
function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

// On augmente le chrono interne et on envoie un éléments dans le tableau de ce qu'il y a a l'écran
function chrono_incrementage() {
    chrono++;
    if (Jeu_en_cours == true) {
        window.setTimeout(chrono_incrementage, 1);
    }

    Object.entries(partition).forEach(([numero_entité, charactéristique]) => {
        if (chrono == charactéristique.timeur) {
            partition_ecran.push(charactéristique);
        }
    })

    // On arrete le jeu si la musique s'arrête
    if (audioMusique.paused && pause_en_cours == false) {
        audioMusique.currentTime = 0;
        if (score >= 15) {
            gagner = true;
        }
        Arreter_jeu();
    }
}

// On démarre le jeu
document.querySelector(".lancer_jeu").addEventListener("click", lancement_du_jeu)

function lancement_du_jeu() {
    document.querySelector(".retour").classList.remove("apparition")
    document.querySelector(".pause").classList.add("apparition")
    document.querySelector(".fond_jeu").classList.add("apparition");
    audioMusique.play()
    audioMusique.volume = 0.3
    chargement_des_notes();
    lockOrientation();
    document.querySelector(".score").classList.add("score_present");
    document.querySelector(".lancement").style = "display: none;";
    Jeu_en_cours = true;
    boucle();
    chrono_incrementage();
}

// On recalcule la taille de la page et des canvas lors de changement de taille de la page
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

// On bloque le site en version portable 
function lockOrientation() {
    W = window.innerWidth;
    H = window.innerHeight;
    const elem = document.documentElement;

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

// On fini le jeu
function Arreter_jeu() {
    document.querySelector(".pause").classList.remove("apparition")
    document.querySelector(".score_fin").innerHTML = "Your score : " + (score * 100);
    document.querySelector(".fond_jeu").classList.remove("apparition");
    partition = []
    document.querySelector(".score").classList.remove("score_present");
    if (gagner == true) {
        document.querySelector(".suite").classList.add("apparition");
    }
    else {
        document.querySelector(".fin_1>.cheatcode").classList.add("apparition");
    }
    if (score >= 15) {
        document.querySelector(".winorlose").innerHTML = "You win !"
    }
    else {
        document.querySelector(".winorlose").innerHTML = "You lose"
    }
    Jeu_en_cours = false;
    ctx_notes.clearRect(0, 0, W, H);
    ctx_personnage.clearRect(0, 0, W, H);
    document.querySelector(".fin").classList.add("apparition");
}

// Plein de fonction avec des clics
document.querySelector(".rejouer").addEventListener("click", rejouer)
document.querySelector(".suite").addEventListener("click", suite_du_jeu)
document.querySelector(".sombre").addEventListener("click", retour)
document.querySelector(".valider").addEventListener("click", lancer_cheat)
document.querySelector(".tuto_video").addEventListener("click", pause)
document.querySelector(".tuto").addEventListener("click", tuto)
document.querySelector(".pause").addEventListener("click", pause_jeu)
document.querySelector(".continuer").addEventListener("click", pause_continuer)
document.querySelector(".restart").addEventListener("click", recommencer)
document.querySelector(".retour_menu").addEventListener("click", retour_au_menu)
document.querySelector(".retour").addEventListener("click", retour_au_menu)
tuto_video.addEventListener('ended', retour);
document.querySelectorAll('.cheatcode').forEach(e => {
    e.addEventListener("click", cheatcode)
})

// On relance le jeu de 0
function rejouer() {
    document.querySelector(".fond_jeu").classList.add("apparition");
    score = 0;
    chrono = 0;
    document.querySelector(".fin").classList.remove("apparition");
    document.querySelector(".fin_1>.cheatcode").classList.remove("apparition")
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

// mettre pause au jeu pour se balader
function pause_jeu() {
    pause_en_cours = true;
    Jeu_en_cours = false;
    document.querySelector(".sombre_pause").classList.add("apparition");
    document.querySelector(".pause_en_cours").classList.add("apparition");
    audioMusique.pause();
}

// Relancer le jeu après la pause
function pause_continuer() {
    pause_en_cours = false;
    audioMusique.play();
    Jeu_en_cours = true;
    document.querySelector(".sombre_pause").classList.remove("apparition");
    document.querySelector(".pause_en_cours").classList.remove("apparition");
    temps_avant = performance.now();
    boucle();
    chrono_incrementage();
}

function recommencer() {
    window.location.href = "../jeu/jeu1.html"
}

function retour_au_menu() {
    window.location.href = "../index.html"
}

// On met la vidéo en pause si on clic dessus
function pause() {
    if (paused == true) {
        paused = false;
        tuto_video.pause();
    }
    else {
        paused = true;
        tuto_video.play();
    }
}

// On a gagné le jeu et on accede a la suite de l'escape game
function suite_du_jeu() {
    localStorage.setItem('progress', 'Jeu1');
    window.location.href = "../index.html"
}

// Ouverture de la pop up de cheat code
function cheatcode() {
    document.querySelector(".cheat").classList.add("apparition")
    document.querySelector(".sombre").classList.add("apparition")
}

// Ouverture de la pop up du tuto et lecture de la video
function tuto() {
    document.querySelector(".tutoriel").classList.add("apparition")
    document.querySelector(".sombre").classList.add("apparition")
    tuto_video.play()
}

// On ferme la pop up du cheat code et du tuto
function retour() {
    document.querySelector(".cheat").classList.remove("apparition")
    document.querySelector(".sombre").classList.remove("apparition")
    document.querySelector(".tutoriel").classList.remove("apparition")
    tuto_video.pause()
    tuto_video.currentTime = 0;
    document.querySelector(".mauvais_cheat").classList.remove("apparition")
}

// On vérifie si le cheat code est bon et si c'est le cas on fait gagner directement le jeu et on passe a la suite
function lancer_cheat() {
    if (document.querySelector(".cheatcode_mdp").value.toLowerCase() === "mmi") {
        suite_du_jeu();
    }
    else {
        document.querySelector(".mauvais_cheat").classList.add("apparition")
    }
}

// Le tableau avec toutes les notes et obstacles qui arrive avec le timeurs auxquels ils arrivent
function chargement_des_notes() {
    partition.push(
        {
            timeur: 5,
            etat: "note",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 455,
            etat: "note",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 900,
            etat: "note",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 1400,
            etat: "obstacle",
            numero: 1,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 1600,
            etat: "note",
            numero: 2,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 1600,
            etat: "obstacle",
            numero: 2,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 2,
            type: "chaise"
        },
        {
            timeur: 1800,
            etat: "obstacle",
            numero: 2,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 2000,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 2300,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 2600,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 2900,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 3400,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 3600,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 3600,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 3,
            type: "chaise"
        },
        {
            timeur: 3900,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 4050,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 4200,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 4350,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 4800,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 5000,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 5000,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 2
        },
        {
            timeur: 5900,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 6100,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 6400,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 6400,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 2
        },
        {
            timeur: 6500,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 6700,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 7000,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 7200,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 7500,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 7600,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 7700,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 7750,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 7900,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 8300,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 8500,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 8700,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 9000,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 9300,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 9300,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 3,
            type: "chaise"
        },
        {
            timeur: 9750,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 9950,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 10050,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 10200,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 10450,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 10700,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 10700,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 2
        },
        {
            timeur: 11000,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        },
        {
            timeur: 11500,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 11500,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 3
        },
        {
            timeur: 11700,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "chaise"
        },
        {
            timeur: 11900,
            etat: "obstacle",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1,
            type: "homme"
        },
        {
            timeur: 12100,
            etat: "note",
            numero: 3,
            vY: 0,
            Y: -150,
            X: 0,
            toucher: false,
            position_partition: 1
        }
    )
}