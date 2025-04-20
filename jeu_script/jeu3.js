// selecteurs sur les différents éléments

document.querySelector('.startGame').addEventListener('click', startGame)
document.querySelector('.defaite>.button-play-again').addEventListener('click', startGame)
document.querySelector('.victoire>.button-play-again').addEventListener('click', startGame)
document.querySelector('.sendingButton').addEventListener('click', cheater)
document.querySelector('.cache_Error').addEventListener('click', closeAll)
document.querySelector('.victoire>.button-victory').addEventListener('click', passerJeu)

document.querySelectorAll('.mapagain').forEach(e => {
    e.addEventListener('click', retournerMap)
})

document.querySelector('.button-single-game').addEventListener('click', close)

const audioTremblement = document.querySelector('.tremblementsAudio');
audioTremblement.volume = 0.2

// coo start : 47.74677388962272, 7.33549761035268
// co victoire :
// 47.747022602578845, 7.336040920713743

// constantes
const approachSound = new AudioContext();
const oscillator = approachSound.createOscillator();
const gainNode = approachSound.createGain();
const panner = approachSound.createStereoPanner();
console.log(panner);

// initialisation volume a 0 de base

oscillator.connect(gainNode);
gainNode.connect(panner);
panner.connect(approachSound.destination);
gainNode.gain.value = 0;


const video = document.querySelector('.video>.global>video');

document.querySelector('.croix-video').addEventListener('click', fermerVideo);
video.addEventListener('ended', fermerVideo);


document.querySelector('.tutorial').addEventListener('click', ouvrirVideo)

// variables pour le jeu (initialisation)

const draw = document.querySelector('#barile')

const ctx = draw.getContext('2d')

let H = window.innerHeight
let W = window.innerWidth

let front = document.querySelector('.avant-tonneau')
let fondjeu = document.querySelector('.fond-jeu')
let back = document.querySelector('.arrière-tonneau')

// le barile

let xBarile = (window.innerWidth / 2) - 175
let yBarile = 120
let yflotte = 160
let yBarileFront = 170

let xCentre = W / 2
let yCentre = 600

let aBarile = 0.001
let vBarile = 0;

let rotaleft = false;
let rotaright = false;

// le alpha on s'en fou

let angle = 0;

let aRedressement = 0;

let VitesseUtilisateur = 0;

let contenu = 100;

let vitesse = 0;

let derniereLat = null;
let derniereLong = null;
let derniertemps = null;
let distance = 0;
let temps = 0;
let coordonnées = [];

let latVictoire = 0;
let longVictoire = 0;

// pour baisser le pourcentage de remplissage du barile

let facteurVideAngle = 0;

// plus la vitesse est grande, plus le tonneau tremble (impacte surtout au début)

let tremblements = 0;
let trembler = 0;
let tempsTremble = 0;
let tremblersense = false;

// pour les matrices : 

let x = 0;
let y = 0;
let z = 0;

// fin du jeu

let victoire = false;
let finJeu = false;

// pour le timer
let start = 0;
let chro = -1;

let now = Date.now();
let timing = 0

let secondes = Math.floor(timing / 1000);
let minutes = Math.floor(secondes / 60);
let secondesSansVirgule = secondes % 60;
let mili = timing % 1000;

let map = L.map('map').setView([47.742293124114774, 7.335626139614205], 18);

// Marqueur mobile (au départ à [0, 0], il sera mis à jour ensuite)
let marker = L.marker([0, 0]).addTo(map);

// Marqueur fixe
let marker2 = L.marker([47.747022602578845, 7.336040920713743]).addTo(map);

// Polygon mobile (au départ avec des coordonnées de base)
let polygon = L.polygon([
    [0, 0],
    [47.747022602578845, 7.336040920713743],
]).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

///////////////////////////////
// Partie position du joueur //
///////////////////////////////

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        latVictoire = position.coords.latitude;
        longVictoire = position.coords.longitude;

        // Mise à jour du marqueur
        marker.setLatLng([latVictoire, longVictoire]);
        marker.bindPopup("<b>Your position !</b>")

        // Mise à jour du polygone
        polygon.setLatLngs([
            [latVictoire, longVictoire],
            [47.747022602578845, 7.336040920713743]
        ]);

        map.setView([latVictoire, longVictoire], 18);



        if (coordonnées.length <= 20) {
            coordonnées.push([position.coords.latitude, position.coords.longitude]);
        }
        else {
            coordonnées.splice(0, 1);
            coordonnées.push([position.coords.latitude, position.coords.longitude]);
        }

        if (coordonnées.length == 21) {
            let latitude = 0;
            let longitude = 0;
            coordonnées.forEach(element => {
                latitude += element[0]
                longitude += element[1]
            });

            latitude = latitude / coordonnées.length
            longitude = longitude / coordonnées.length

            let tempsActuel = Date.now();

            // faire une moyenne des points et afficher la distance après
            if (derniereLat && derniereLong) {
                distance = calculeDistance(derniereLat, derniereLong, latitude, longitude)


                temps = (tempsActuel - derniertemps) / 1000;
                if (temps > 0) {
                    vitesse = (distance / temps) * 3600; // km/h
                    if (vitesse == 0) {
                        vitesse = 1;
                    }
                }
            }

            derniereLat = latitude
            derniereLong = longitude
            derniertemps = tempsActuel
        }
    }, (error) => {
        console.error("Erreur de géolocalisation :", error);
    }, { enableHighAccuracy: true, timeout: 1000 });
}
else {
    console.log('le navigateur ne supporte pas la geolocalisation')
}

/////////////////////////////////////////////
// Partie calcule de la distance parcourue //
////////////////////////////////////////////

function calculeDistance(lastlat, lastlong, lat, long) {
    // transition des coordonnée données par la position de l'utulisateur en KM, aide de l'IA pour cela

    // rayon de la terre de la terre, car les coordonnées sont basées sur des degrés decimaux, pour calculer une distance, on peut utiliser la formule Haversine trouvée sur internet 
    // fonction trouvée sur internet et convertie en code, un enfer
    const RayonTerre = 6371;

    const radiants = Math.PI / 180;

    let a = (Math.sin(((lat - lastlat) * radiants) / 2) * Math.sin(((lat - lastlat) * radiants) / 2)) + Math.cos(lastlat * radiants) * Math.cos(lat * radiants) * (Math.sin(((long - lastlong) * radiants) / 2) * Math.sin(((long - lastlong) * radiants) / 2))

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return RayonTerre * c;

    // distance en km
}

//////////////////////////////
// Orientation du téléphone //
//////////////////////////////

window.addEventListener('deviceorientation', inclinaison_tel, true)

function inclinaison_tel(event) {
    let matrix = getRotationMatrix(event.alpha, event.beta, event.gamma)

    let rotation = EulerAngle(matrix)

    aRedressement = 0.0001 * -rotation
}

// pour transformer les angles en une matrice de rotation
function getRotationMatrix(alpha, beta, gamma) {
    const radiants = Math.PI / 180

    let cX = Math.cos(beta * radiants)
    let cY = Math.cos(gamma * radiants);
    let cZ = Math.cos(alpha * radiants);
    let sX = Math.sin(beta * radiants);
    let sY = Math.sin(gamma * radiants);
    let sZ = Math.sin(alpha * radiants);

    let m11 = cZ * cY - sZ * sX * sY;
    let m12 = - cX * sZ;
    let m13 = cY * sZ * sX + cZ * sY;

    let m21 = cY * sZ + cZ * sX * sY;
    let m22 = cZ * cX;
    let m23 = sZ * sY - cZ * cY * sX;

    let m31 = - cX * sY;
    let m32 = sX;
    let m33 = cX * cY;

    return [
        m13, m11, m12,
        m23, m21, m22,
        m33, m31, m32
    ];
}

// fonction pour transformer les valeurs de la matrice en un angle

function EulerAngle(matrix) {
    var retouraudegre = 180 / Math.PI; // Radian-to-Degree conversion
    let sy = Math.sqrt(matrix[0] * matrix[0] + matrix[3] * matrix[3]);

    let singular = sy < 1e-6; // If

    if (!singular) {
        x = Math.atan2(matrix[7], matrix[8]);
        y = Math.atan2(-matrix[6], sy);
        z = Math.atan2(matrix[3], matrix[0]);
    } else {
        x = Math.atan2(-matrix[5], matrix[4]);
        y = Math.atan2(-matrix[6], sy);
        z = 0;
    }

    return retouraudegre * x;
}

function initialisation() {
    draw.width = window.innerWidth;
    draw.height = window.innerHeight;
}

// Calcules de la page

function calculer() {
    if ((latVictoire >= 47.74682 && latVictoire <= 47.74722 && longVictoire >= 7.33584 && longVictoire <= 7.33624) || contenu <= 1) {
        finJeu = true;
    }
    VitesseUtilisateur = 1 / vitesse * 1000;
    // faire trembler le tonneau
    if (vitesse >= 3) {
        if (contenu >= 1) {
            tremblements = (vitesse * 0.0002) * (contenu / 70);
        }
        else {
            tremblements = 0;
        }
        audioTremblement.play();
        if (tremblersense) {
            if (tempsTremble <= (20 / vitesse)) {
                tempsTremble += 1
            }
            else {
                tremblersense = false;
            }
            trembler = 0.8;
        }
        else {
            if (tempsTremble >= 0) {
                tempsTremble -= 1
            }
            else {
                tremblersense = true;
            }
            trembler = - 0.8;
        }
    }
    else {
        tremblements = 0;
        audioTremblement.pause();
    }

    contenu -= tremblements;
    // random pour la rotation du tonneau

    let Random = parseInt(Math.random() * VitesseUtilisateur)
    if (Random == 1) {
        let R2 = parseInt(Math.random() * 10)

        if (R2 <= 4) {
            rotaleft = true;
            rotaright = false;
        }

        if (R2 >= 5) {
            rotaright = true;
            rotaleft = false;
        }
    }
    // rotation aléatoire
    if (rotaleft) {
        vBarile -= aBarile;
    }
    if (rotaright) {
        vBarile += aBarile;
    }
    vBarile += aRedressement;

    // angle qui ne peut pas dépasser les 90 degrés (le tonneau est tombé et rebondi)

    if (angle >= 90) {
        angle = 90;
        vBarile = vBarile * -0.5;
    }
    if (angle <= -90) {
        angle = -90;
        vBarile = vBarile * -0.5;
    }
    if (angle <= 90 && angle >= -90) {
        angle += vBarile;
        if (angle >= 10 || angle <= -10) {
            if (angle >= 10) {
                gainNode.gain.value = 0.2;
                oscillator.frequency.value = angle * 20;
                panner.pan.value = 1; // son dans l'oreille droite
            }
            if (angle <= -10) {
                gainNode.gain.value = 0.2;
                oscillator.frequency.value = angle * 20;
                panner.pan.value = -1; // son dans l'oreille droite
            }
        }
        else {
            gainNode.gain.value = 0;
        }
    }

    // si le tonneau est plus penché, ca se vide plus facilement.

    if (contenu >= 90) {
        if (angle >= 0) {
            facteurVideAngle = (-angle * 0.001) * (contenu / 60)
        }
        else {
            facteurVideAngle = (angle * 0.001) * (contenu / 60)
        }
    }
    else {
        if (angle >= 30 || angle <= -30) {
            if (angle >= 0) {
                facteurVideAngle = (-angle * 0.001) * (contenu / 60)
            }
            else {
                facteurVideAngle = (angle * 0.001) * (contenu / 60)
            }
        }
        else {
            facteurVideAngle = 0
        }
    }
    contenu += facteurVideAngle;
    document.querySelector('.info1').innerHTML = `Speed : <div class='vitesse'>${Math.floor(vitesse * 100) / 100} km/h</div>`;
    document.querySelector('.contenu').innerHTML = `Barrel's content : <div class='pourcents'>${Math.round(contenu * 100) / 100} %</div>`
}


function afficher() {
    console.log(W);
    ctx.fillStyle = "#09C";
    ctx.drawImage(fondjeu, 0, 0, W + 350, H);

    function dessinerRectangle(yDéplacement, taille, image) {
        // Store the current context state (i.e. rotation, translation etc..)
        ctx.save()
        ctx.translate(xCentre, yCentre + trembler);
        // tourner le canvas.
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(image, -500 / 2, (yDéplacement - taille / 2) + trembler, 500, taille);

        drawGouttes();

        // restorer l'image de base
        ctx.restore();
    }

    dessinerRectangle(0, 600, back);  // Baril
    dessinerRectangle(0, 600, back);
    dessinerRectangle(0, 600, front); // Avant du baril
}

// dessiner les grouttes pour avoir le fluide 

let gouttes = [
    {
        x: xBarile,	// Position en X.
        y: yBarile,	// Position en Y.
        vx: 0.5,	// Vitesse sur l’axe X.
        vy: 0.8,	// Vitesse sur l’axe Y.
        couleurGoutte: "#"
    },
    {
        x: 450,	// Position en X.
        y: 700,	// Position en Y.
        vx: 0.5,	// Vitesse sur l’axe X.
        vy: 0.8	// Vitesse sur l’axe Y.
    }
]

function drawGouttes(){
    
    gouttes.forEach(e=>{
        ctx.fillStyle = e.couleurGoutte
    })
}

function stopGame() {
    gainNode.gain.value = 0;
    document.querySelectorAll('.time').forEach(e => {
        e.innerHTML = 'Your Time = ' + minutes + 'm : ' + secondes + 's : ' + mili + "ms";
    })
    document.querySelectorAll('.content-barel-end').forEach(e => {
        e.innerHTML = 'Content of the barrel : ' + Math.floor(contenu * 100) / 100;
    })
    if (victoire) {
        document.querySelector('.victoire').classList.add('openEndGame')
    }
    else {
        document.querySelector('.defaite').classList.add('openEndGame')
    }
    clearTimeout(chro);
    chro = minutes + 'm : ' + secondes + 's : ' + mili + "ms";
}

function boucle() {
    if (finJeu) {
        if (contenu >= 50) {
            victoire = true;
        }
        else {
            victoire = false;
        }

        stopGame();
    }
    else {
        calculer()
        afficher()
        window.requestAnimationFrame(boucle)
    }
}

// débuter le jeu

function startGame() {
    // Réinitialisation des valeures
    angle = 0;
    rotaleft = false;
    rotaright = false;
    aRedressement = 0;
    VitesseUtilisateur = 0;
    contenu = 100;
    vitesse = 0;
    facteurVideAngle = 0;
    tremblements = 0;
    trembler = 0
    tempsTremble = 0;
    tremblersense = 0;
    victoire = false;
    finJeu = false;

    chro = 0
    start = Date.now();

    if (latVictoire >= 47.74657 && latVictoire <= 47.74697 && longVictoire >= 7.33529 && longVictoire <= 7.33569) {
        BloquerPleinEcran();

        // time out permettant de laisser le temsp à l'ecran de s'adapter (sinon le canvas ne s'adapte pas, et c'est moins joli.)
        setTimeout(()=>{
            H = window.innerHeight
            W = window.innerWidth
    
            const audio = document.getElementById("audio");
    
            document.querySelector('.victoire').classList.remove('openEndGame')
            document.querySelector('.defaite').classList.remove('openEndGame')
    
            // Date.now ou performance.now
            audio.play();
            audio.volume = 0.4;
            initialisation();
            chronoT();
    
            if (this.className == "startGame") {
                oscillator.start();
            }
    
            boucle();
            document.querySelector('.first').classList.add('none')
        }, 300);
    }
    else {
        document.querySelector('.errorWindow').classList.remove('closerror');
        document.querySelector('.errorWindow').classList.add('ouvrirerror')
        document.querySelector('.cache_Error').classList.add('ouvrirCache');
    }
}

// fermer la pop up
function close() {
    document.querySelector('.errorWindow').classList.add('closerror');
    document.querySelector('.errorWindow').classList.remove('ouvrirerror');
    document.querySelector('.cache_Error').classList.remove('ouvrirCache');
}

// ouvrir la video
function ouvrirVideo() {
    document.querySelector('.video').classList.add('ouvrir');
    document.querySelector('.video').classList.remove('closevid');
    document.querySelector('.cache_Error').classList.add('ouvrirCache');
    video.play();
}

// fermer la video
function fermerVideo() {
    document.querySelector('.video').classList.add('closevid');
    document.querySelector('.video').classList.remove('ouvrir');
    document.querySelector('.cache_Error').classList.remove('ouvrirCache');
    video.pause();
}

function chronoT() {
    chro = setInterval(function () {
        now = Date.now();
        timing = now - start

        secondes = Math.floor(timing / 1000);
        minutes = Math.floor(secondes / 60);
        secondesSansVirgule = secondes % 60;
        mili = timing % 1000;

        document.querySelector('.timer').innerHTML = minutes + ':' + secondesSansVirgule + ':' + mili
    }, 16);
}

function cheater() {
    let valeur = document.querySelector('.CheatCode').value


    if (valeur.toLowerCase() == 'mmi') {
        localStorage.setItem('progress', 'Jeu3');
        window.location.href = "../index.html";
    }
    else {
        document.querySelector('.errorElse').classList.add('ouvrirerror');
        document.querySelector('.cache_Error').classList.add('ouvrirCache');
    }
}

function fermerError() {
    document.querySelector('.errorWindow').classList.add('closerror');
    document.querySelector('.errorElse').classList.remove('ouvrirerror');
    document.querySelector('.cache_Error').classList.remove('ouvrirCache');
}

function closeAll() {
    document.querySelector('.errorWindow').classList.remove('ouvrirerror');
    document.querySelector('.cache_Error').classList.remove('ouvrirCache');

    document.querySelector('.errorElse').classList.remove('ouvrirerror');
    document.querySelector('.cache_Error').classList.remove('ouvrirCache');
}

function passerJeu() {
    localStorage.setItem('progress', 'Jeu3');
    window.location.href = "../index.html";
}

function retournerMap() {
    localStorage.setItem('progress', 'Jeu2');
    window.location.href = "../index.html";
}

function BloquerPleinEcran() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen()
            .then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('portrait')
                        .catch((error) => {
                            console.error('Erreur lors du verrouillage de l\'orientation :'+ error);
                        });
                }
            });
    }
}