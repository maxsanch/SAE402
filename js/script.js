// initialisaion

let latitude = 0;
let longitude = 0;

let started = localStorage.getItem('started') || "non";
let progress = localStorage.getItem('progress') || "intro"

var map = L.map('map').setView([0, 0], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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

// la partie histoire

let number = 0;
document.querySelector('.histoire').addEventListener('click', gérerHistoire)

function gérerHistoire() {
    progress = localStorage.getItem('progress');

    fetch('js/dialogues.json')
    .then(function(reponse){
        return reponse.json();
    })
    .then(function (rep){
        switch (progress) {
            case "intro":
                document.querySelector('.personnage1').style = "display: none;";
                document.querySelector('.personnage2').style = "display: none;";
                document.querySelector('.bgFixed>img').src = 'img/fond'+progress+'.jpg';
                console.log(rep.intro[0].Dialogues.length)
                if(number < rep.intro[0].Dialogues.length){
                    console.log(rep.intro[0].Dialogues[number].Sentance)
                    document.querySelector('.bulleDialogue').innerHTML = rep.intro[0].Dialogues[number].Sentance
                    number++;
                }
                if(number == rep.intro[0].Dialogues.length){
                    localStorage.setItem('progress', 'scene1')
                }
                break;
            case "scene1":
                break;
            default: 
                console.log("une erreur est survenue")
        }
    })
}