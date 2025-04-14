// initialisaion

let latitude = 0;
let longitude = 0;

let started = localStorage.getItem('started') || "non";
let progress = localStorage.getItem('progress') || "intro";


// initialisation histoire 

// la partie histoire

let number = 0;
let ecriture = false;

var map = L.map('map').setView([0, 0], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let pointAtteint = false;

switch (progress) {
    case "Jeu1":
        pts = [
            L.latLng(0, 0),
            L.latLng(47.7476668973079, 7.333935237261866),
            L.latLng(47.74677388962272, 7.33549761035268),
        ]
        break;
    case "Jeu2":
        pts = [
            L.latLng(0, 0),
            L.latLng(47.74677388962272, 7.33549761035268),
        ]
        break;
    case "Jeu3":
        pts = [
            L.latLng(0, 0)
        ]
        break;
    default:
        pts = [
            L.latLng(0, 0),
            L.latLng(47.74693247591911, 7.333608821941789),
            L.latLng(47.7476668973079, 7.333935237261866),
            L.latLng(47.74677388962272, 7.33549761035268),
        ]
}
const routingControl = L.Routing.control({
    waypoints: pts,
    draggableWaypoints: false,
    addWaypoints: false
}).addTo(map);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        map.setView([latitude, longitude], 15);

        // Mise à jour du premier waypoint
        const placeActuelle = routingControl.getWaypoints();
        placeActuelle[0] = L.Routing.waypoint(L.latLng(latitude, longitude));

        routingControl.setWaypoints(placeActuelle);

        switch (progress){
            case 'preBar':
                if(latitude >= 47.74673 && latitude <= 47.74713 && longitude >= 7.33340 && longitude <= 7.33380){
                    if(pointAtteint === false){
                        // faire l'action ici
                        localStorage.setItem('progress', 'bar');
                        gérerHistoire()
                        pointAtteint = true
                    }
                }
                break;
            case 'preRun':
                if(latitude >= 47.74746 && latitude <= 47.74786 && longitude >= 7.33373 && longitude <= 7.33413){
                    if(pointAtteint === false){
                        // faire l'action ici
                        localStorage.setItem('progress', 'run');
                        gérerHistoire()
                        pointAtteint = true
                    }
                }
                break;
            case 'preBarrel':
                if(latitude >= 47.74673 && latitude <= 47.74713 && longitude >= 7.33340 && longitude <= 7.33380){
                    if(pointAtteint === false){
                        // faire l'action ici
                        localStorage.setItem('progress', 'barrel');
                        gérerHistoire()
                        pointAtteint = true
                    }
                }
                break;
            default:
                console.log("pas d'impacte")
        }

    }, (error) => {
        console.log("Erreur de géolocalisation :", error);
    }, { enableHighAccuracy: true, timeout: 1000 });
}
else {
    console.log('le navigateur ne supporte pas la geolocalisation')
}


// les canvas

let canvaparti = document.querySelector('#particules')

const ctx = canvaparti.getContext('2d')

let H = 0;
let W = 0;

let tab = [
    {
        x: 20,	// Position en X.
        y: 800,	// Position en Y.
        vx: -0.14,	// Vitesse sur l’axe X.
        vy: -0.14,	// Vitesse sur l’axe Y.
        taille: 5
    },
    {
        x: 30,	// Position en X.
        y: 700,	// Position en Y.
        vx: -0.8,	// Vitesse sur l’axe X.
        vy: -0.5,	// Vitesse sur l’axe Y.
        taille: 4
    },
    {
        x: 60,	// Position en X.
        y: 659,	// Position en Y.
        vx: -0.6,	// Vitesse sur l’axe X.
        vy: -0.4,	// Vitesse sur l’axe Y.
        taille: 11
    },
    {
        x: 10,	// Position en X.
        y: 560,	// Position en Y.
        vx: -0.4,	// Vitesse sur l’axe X.
        vy: -0.3,	// Vitesse sur l’axe Y.
        taille: 7
    },
    {
        x: 150,	// Position en X.
        y: 780,	// Position en Y.
        vx: -0.3,	// Vitesse sur l’axe X.
        vy: -0.4,	// Vitesse sur l’axe Y.
        taille: 6
    },
    {
        x: 80,	// Position en X.
        y: 800,	// Position en Y.
        vx: -0.3,	// Vitesse sur l’axe X.
        vy: -0.6,	// Vitesse sur l’axe Y.
        taille: 8
    },
    {
        x: 160,	// Position en X.
        y: 850,	// Position en Y.
        vx: -0.2,	// Vitesse sur l’axe X.
        vy: -0.4,	// Vitesse sur l’axe Y.
        taille: 8
    },
    {
        x: 140,	// Position en X.
        y: 760,	// Position en Y.
        vx: -0.5,	// Vitesse sur l’axe X.
        vy: -0.2,	// Vitesse sur l’axe Y.
        taille: 4
    },
    {
        x: 250,	// Position en X.
        y: 870,	// Position en Y.
        vx: -0.5,	// Vitesse sur l’axe X.
        vy: -0.4,	// Vitesse sur l’axe Y.
        taille: 5
    },
    {
        x: 45,	// Position en X.
        y: 780,	// Position en Y.
        vx: -0.2,	// Vitesse sur l’axe X.
        vy: -0.4,	// Vitesse sur l’axe Y.
        taille: 6
    },
    {
        x: 150,	// Position en X.
        y: 780,	// Position en Y.
        vx: -0.4,	// Vitesse sur l’axe X.
        vy: -0.5,	// Vitesse sur l’axe Y.
        taille: 9
    },
    {
        x: 65,	// Position en X.
        y: 842,	// Position en Y.
        vx: -0.1,	// Vitesse sur l’axe X.
        vy: -0.2,	// Vitesse sur l’axe Y.
        taille: 6
    },
    {
        x: 20,	// Position en X.
        y: 760,	// Position en Y.
        vx: -0.5,	// Vitesse sur l’axe X.
        vy: -0.3,	// Vitesse sur l’axe Y.
        taille: 6
    },
    {
        x: 56,	// Position en X.
        y: 740,	// Position en Y.
        vx: -0.2,	// Vitesse sur l’axe X.
        vy: -0.2,	// Vitesse sur l’axe Y.
        taille: 7
    },
    {
        x: 69,	// Position en X.
        y: 862,	// Position en Y.
        vx: -0.5,	// Vitesse sur l’axe X.
        vy: -0.3,	// Vitesse sur l’axe Y.
        taille: 3
    },
    {
        x: 45,	// Position en X.
        y: 840,	// Position en Y.
        vx: -0.5,	// Vitesse sur l’axe X.
        vy: -0.2,	// Vitesse sur l’axe Y.
        taille: 9
    },
]

function initialisation() {
    H = window.innerHeight
    W = window.innerWidth

    canvaparti.width = window.innerWidth
    canvaparti.height = window.innerHeight
}

function boucle() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    tab.forEach(e => {
        e.x += e.vx
        e.y += e.vy

        if (e.x <= - 20) {
            e.y = window.innerHeight + 50
            e.x = 200
        }

        // Création d'un gradient radial centré sur la particule

        let gradient = ctx.createRadialGradient(
            e.x + e.taille / 2, e.y + e.taille / 2, 0,  // Centre du gradient
            e.x + e.taille / 2, e.y + e.taille / 2, e.taille / 2 // Rayon extérieur
        );

        // Ajout des couleurs (effet lumineux)
        gradient.addColorStop(0, "yellow"); // Blanc au centre
        gradient.addColorStop(0.7, "orange"); // Bleu intermédiaire

        // Application du gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(e.x, e.y, e.taille, e.taille)
    })
    window.requestAnimationFrame(boucle)
}

function transition() {
    console.log('pending')
}

initialisation();
boucle();

document.querySelector('.bouton-main-page').addEventListener('click', commencer)

function commencer() {
    localStorage.setItem("started", "oui")
    document.querySelector('.startpart').style = "display: none;"
    gérerHistoire();
}

if (started == 'oui') {
    commencer()
}

document.querySelector('.barres').addEventListener('click', ouvrirbarres)
document.querySelector('.cache-black').addEventListener('click', ouvrirbarres)

function ouvrirbarres() {
    let barres = localStorage.getItem('menu') || 'categories';
    document.querySelector('.' + barres).classList.toggle('ouvert');
    document.querySelector('.cache-black').classList.toggle('ouvert')
    map.invalidateSize();
    map.setView([latitude, longitude], 13);
}

document.querySelector('.games').addEventListener('click', opencategorie)
document.querySelector('.story').addEventListener('click', opencategorie)
document.querySelector('.map').addEventListener('click', opencategorie)

function opencategorie() {
    if (this.className == "games") {
        localStorage.setItem('menu', 'jeux');
        document.querySelector('.jeux').classList.add('ouvert')
        document.querySelector('.categories').classList.remove('ouvert')
    }
    if (this.className == "map") {
        localStorage.setItem('menu', 'mapo');
        document.querySelector('.mapo').classList.add('ouvert')
        document.querySelector('.categories').classList.remove('ouvert')
        map.invalidateSize();
        map.setView([latitude, longitude], 13);
    }
    if (this.className == "story") {
        localStorage.setItem('menu', 'story-resume');
        document.querySelector('.story-resume').classList.add('ouvert')
        document.querySelector('.categories').classList.remove('ouvert')
    }
}

document.querySelectorAll('.retour').forEach(e => {
    e.addEventListener('click', retour)
})



function retour() {
    localStorage.setItem('menu', 'categories');
    document.querySelector('.categories').classList.add('ouvert')
    document.querySelector('.story-resume').classList.remove('ouvert')
    document.querySelector('.mapo').classList.remove('ouvert')
    document.querySelector('.jeux').classList.remove('ouvert')
}

document.querySelector('.histoire').addEventListener('click', gérerHistoire)

function print(dialogue) {
    let n = 0;
    let contenu = document.querySelector('.bulleDialogue')

    contenu.innerHTML = "";
    ecriture = true;

    let intervale = setInterval(() => {
        contenu.innerHTML += dialogue.charAt(n);
        n++;
        if (n >= dialogue.length) {
            clearInterval(intervale);
            ecriture = false;
        }
    }, 16)
}

function gérerHistoire() {
    if (ecriture) {
        return;
    }

    progress = localStorage.getItem('progress');

    fetch('js/dialogues.json')
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (rep) {
            switch (progress) {
                case "intro":
                    document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';
                    document.querySelector('.personnage1').style = "display: none;";
                    document.querySelector('.personnage2').style = "display: none;";

                    if (number < rep.intro[0].Dialogues.length) {
                        print(rep.intro[0].Dialogues[number].Sentance)
                        number++;
                    }
                    if (number == rep.intro[0].Dialogues.length) {
                        localStorage.setItem('progress', 'scene1')
                        number = 0;
                    }
                    break;
                case 'scene1':
                    if (number == 0) {
                        document.querySelector('.cacheAppearDesapear').style = 'display: block;';
                        document.querySelector('.cacheAppearDesapear').classList.add('AnimationCache')
                        setTimeout(function () {
                            document.querySelector('.cacheAppearDesapear').style = 'display: none;';
                            document.querySelector('.cacheAppearDesapear').classList.remove('AnimationCache')
                        }, 1000)

                        setTimeout(function () {
                            document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';

                            document.querySelector('.personnage1').style = "display: block;";
                            document.querySelector('.personnage2').style = "display: block;";
                            document.querySelector('.personnage1>img').src = 'img/personnages/' + rep[progress][0].CharacterOne + '.png'
                            document.querySelector('.personnage2>img').src = 'img/personnages/' + rep[progress][0].CharacterTwo + '.png'
                        }, 500)
                    }

                    if (number < rep[progress][0].Dialogues.length) {
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoTalk).classList.add('parler')
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoDontTalk).classList.remove('parler')
                        print(rep[progress][0].Dialogues[number].Sentance)
                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'preBar');
                        number = 0;
                    }
                    break;
                case 'preBar':
                    localStorage.setItem('menu', 'mapo');
                    document.querySelector('.mapo').classList.add('ouvert')
                    document.querySelector('.categories').classList.remove('ouvert')
                    document.querySelector('.cache-black').classList.toggle('ouvert')
                    map.invalidateSize();
                    map.setView([latitude, longitude], 13);
                    break;
                case 'bar':
                    if (number == 0) {
                        document.querySelector('.cacheAppearDesapear').style = 'display: block;';
                        document.querySelector('.cacheAppearDesapear').classList.add('AnimationCache')
                        setTimeout(function () {
                            document.querySelector('.cacheAppearDesapear').style = 'display: none;';
                            document.querySelector('.cacheAppearDesapear').classList.remove('AnimationCache')
                        }, 1000)

                        setTimeout(function () {
                            document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';

                            document.querySelector('.personnage1').style = "display: block;";
                            document.querySelector('.personnage2').style = "display: block;";
                            document.querySelector('.personnage1>img').src = 'img/personnages/' + rep[progress][0].CharacterOne + '.png'
                            document.querySelector('.personnage2>img').src = 'img/personnages/' + rep[progress][0].CharacterTwo + '.png'
                        }, 500)
                    }

                    if (number < rep[progress][0].Dialogues.length) {
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoTalk).classList.add('parler')
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoDontTalk).classList.remove('parler')
                        print(rep[progress][0].Dialogues[number].Sentance)
                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'preBar');
                        number = 0;
                    }
                    break;
                default:
                    console.log('une erreur est survenue.')
            }
        })
}