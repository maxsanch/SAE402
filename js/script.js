// initialisaion

let latitude = 0;
let longitude = 0;


if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        var map = L.map('map').setView([latitude, longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        L.Routing.control({
            waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(47.74696420259903, 7.333642888445753)
            ]
        }).addTo(map);
    }, function (erreur) {
        console.log(erreur)

        var map = L.map('map').setView([latitude, longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    })

    if (latitude != 0 && longitude != 0) {
        console.log(latitude)
    }
}
else {
    console.log("Géolocalisation non supportée");
    var map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
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
        if(e.x <= 0){
        
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

initialisation();
boucle();