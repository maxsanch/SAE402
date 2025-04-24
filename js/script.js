// initialisaion

let latitude = 0;
let longitude = 0;

let started = localStorage.getItem('started') || "non";
let progress = localStorage.getItem('progress') || "intro";


const audioMain = document.querySelector('.audioMain');
audioMain.volume = 0.2

// initialisation histoire 

// la partie histoire

let number = 0;
let ecriture = false;

// carte du monde

var map = L.map('map').setView([0, 0], 18);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let pointAtteint = false;

let polygon = L.polygon([
    [0, 0],
    [47.7476668973079, 7.333935237261866],
]).addTo(map);

switch (progress) {
    // vérifier la progression du joueur
    case "Jeu1":
        pts = [
            L.latLng(0, 0),
            L.latLng(47.7476668973079, 7.333935237261866),
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
        ]
}

// changer les routings controls

const routingControl = L.Routing.control({
    waypoints: pts,
    draggableWaypoints: false,
    addWaypoints: false
}).addTo(map);

if (navigator.geolocation) {
    // regarder la position du joueur
    navigator.geolocation.watchPosition(position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        let distance = map.distance(map.getCenter(), L.latLng(latitude, longitude));

        if (distance > 50) { // 50 mètres de tolérance pour bouger la map (palier au probleme qu'on ne eut pas zoomer, car c'était chiantos)
            map.setView([latitude, longitude], 18);
        }

        // Mise à jour du premier waypoint
        const placeActuelle = routingControl.getWaypoints();
        placeActuelle[0] = L.Routing.waypoint(L.latLng(latitude, longitude));

        routingControl.setWaypoints(placeActuelle);

        switch (progress) {
            // vérifier la progression du joueur
            case "Jeu1":
            case "preRun":
            case "run":
                polygon.setLatLngs([
                    [latitude, longitude],
                    [47.7476668973079, 7.333935237261866]
                ]);
                break;
            case "Jeu2":
            case "barrel":
                polygon.setLatLngs([
                    [latitude, longitude],
                    [47.74677388962272, 7.33549761035268]
                ]);
                break;
            case "Jeu3":
                polygon.setLatLngs([
                    [latitude, longitude]
                ]);
                break;
            default:
                polygon.setLatLngs([
                    [latitude, longitude],
                    [47.74693247591911, 7.333608821941789]
                ]);
        }

        switch (progress) {
            case 'preBar':
                if (latitude >= 47.74673 && latitude <= 47.74713 && longitude >= 7.33340 && longitude <= 7.33380) {
                    if (pointAtteint === false) {
                        // faire l'action ici
                        localStorage.setItem('progress', 'bar');
                        gérerHistoire()
                        pointAtteint = true
                    }
                }
                break;
            case 'preRun':
                if (latitude >= 47.74746 && latitude <= 47.74786 && longitude >= 7.33373 && longitude <= 7.33413) {
                    if (pointAtteint === false) {
                        // faire l'action ici
                        localStorage.setItem('progress', 'run');
                        gérerHistoire()
                        pointAtteint = true
                    }
                }
                break;
            case 'Jeu2':
                if (latitude >= 47.74657 && latitude <= 47.74697 && longitude >= 7.33529 && longitude <= 7.33569) {
                    if (pointAtteint === false) {
                        // faire l'action ici
                        localStorage.setItem('progress', 'barrel');
                        gérerHistoire()
                        pointAtteint = true
                    }
                }
                break;
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

// tableau de particules

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

// initialisation

function initialisation() {
    H = window.innerHeight
    W = window.innerWidth

    canvaparti.width = window.innerWidth
    canvaparti.height = window.innerHeight
}

// boucle pour les particules du début

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

initialisation();
boucle();

// commencer la partie

document.querySelector('.bouton-main-page').addEventListener('click', commencer)

function commencer() {
    localStorage.setItem("started", "oui");
    localStorage.setItem('progress', 'intro');

    document.querySelector('.startpart').classList.add('removeStart');

    audioMain.play();
    gérerHistoire();
    lockOrientation();
}

// si c'est déja commencé, alors on a pas besoin de restart

if (started == 'oui') {
    document.querySelector('.startpart').style = "display: none;"
    gérerHistoire();
    lockOrientation();
}

// ouvrir le menu

document.querySelector('.barres').addEventListener('click', ouvrirbarres)
document.querySelector('.cache-black').addEventListener('click', ouvrirbarres)

function ouvrirbarres() {
    let barres = localStorage.getItem('menu') || 'categories';
    document.querySelector('.' + barres).classList.toggle('ouvert');
    document.querySelector('.cache-black').classList.toggle('ouvert')
    map.invalidateSize();
    map.setView([latitude, longitude], 18);
}

// ouvrir une catégorie

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
        map.setView([latitude, longitude], 18);
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


// retour en arrière

function retour() {
    localStorage.setItem('menu', 'categories');
    document.querySelector('.categories').classList.add('ouvert')
    document.querySelector('.story-resume').classList.remove('ouvert')
    document.querySelector('.mapo').classList.remove('ouvert')
    document.querySelector('.jeux').classList.remove('ouvert')
}

document.querySelector('.histoire').addEventListener('click', gérerHistoire)

// écrire ligne par lignes les dialogues

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

// gérer TOUTE l'histoire

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
                // une fois les dialogues cherchés, on a une fonction qui ajoute, poru chaque scene, les bons texts, même processus partout
                case "intro":
                    document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';
                    document.querySelector('.personnage1').style = "display: none;";
                    document.querySelector('.personnage2').style = "display: none;";

                    if (number < rep.intro[0].Dialogues.length) {
                        print(rep.intro[0].Dialogues[number].Sentance)

                        let lecture = document.querySelector('.lecteur').innerHTML

                        lecture = rep.intro[0].Dialogues[number].Sentance

                        let synthese = window.speechSynthesis
                        let vocal = new SpeechSynthesisUtterance(lecture)

                        vocal.lang = 'en-US';

                        synthese.speak(vocal);

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

                        let lecture = document.querySelector('.lecteur').innerHTML

                        lecture = rep[progress][0].Dialogues[number].Sentance

                        let synthese = window.speechSynthesis
                        let vocal = new SpeechSynthesisUtterance(lecture)

                        vocal.lang = 'en-US';

                        synthese.speak(vocal);


                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'preBar');
                        number = 0;
                    }
                    break;
                case 'preBar':
                    // ouvrir la map quand on doit aller quelque part
                    localStorage.setItem('menu', 'mapo');
                    document.querySelector('.bulleDialogue').style = "display: none;"
                    document.querySelector('.personnage1').style = "display: none;"
                    document.querySelector('.personnage2').style = "display: none;"
                    document.querySelector('.mapo').classList.add('ouvert')
                    document.querySelector('.categories').classList.remove('ouvert')
                    document.querySelector('.cache-black').classList.toggle('ouvert')
                    map.invalidateSize();
                    map.setView([latitude, longitude], 18);
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
                            document.querySelector('.bulleDialogue').style = "display: block;"
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
                        document.querySelector('.lecteur').innerHTML = rep[progress][0].Dialogues[number].Sentance
                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'startJeu1');
                        number = 0;
                    }
                    break;
                case "startJeu1":
                    window.location.href = "jeu/jeu1.html";
                    break;
                case "Jeu1":
                    if (number == 0) {
                        document.querySelector('.cacheAppearDesapear').style = 'display: block;';
                        document.querySelector('.cacheAppearDesapear').classList.add('AnimationCache')
                        setTimeout(function () {
                            document.querySelector('.cacheAppearDesapear').style = 'display: none;';
                            document.querySelector('.cacheAppearDesapear').classList.remove('AnimationCache')
                        }, 1000)

                        setTimeout(function () {
                            document.querySelector('.bgFixed>img').src = 'img/fondbar.jpg';

                            document.querySelector('.personnage1>img').src = 'img/personnages/' + rep[progress][0].CharacterOne + '.png'
                            document.querySelector('.personnage2>img').src = 'img/personnages/' + rep[progress][0].CharacterTwo + '.png'
                        }, 500)
                    }

                    if (number < rep[progress][0].Dialogues.length) {
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoTalk).classList.add('parler')
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoDontTalk).classList.remove('parler')
                        print(rep[progress][0].Dialogues[number].Sentance)
                        document.querySelector('.lecteur').innerHTML = rep[progress][0].Dialogues[number].Sentance
                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'preRun');
                        number = 0;
                    }
                    break;
                case 'preRun':
                    // ouvrir la map quand on doit aller quelque part
                    localStorage.setItem('menu', 'mapo');
                    document.querySelector('.bulleDialogue').style = "display: none;"
                    document.querySelector('.personnage1').style = "display: none;"
                    document.querySelector('.personnage2').style = "display: none;"
                    document.querySelector('.mapo').classList.add('ouvert')
                    document.querySelector('.categories').classList.remove('ouvert')
                    document.querySelector('.cache-black').classList.toggle('ouvert')
                    map.invalidateSize();
                    map.setView([latitude, longitude], 18);
                    break;
                case 'run':
                    if (number == 0) {
                        document.querySelector('.cacheAppearDesapear').style = 'display: block;';
                        document.querySelector('.cacheAppearDesapear').classList.add('AnimationCache')
                        setTimeout(function () {
                            document.querySelector('.cacheAppearDesapear').style = 'display: none;';
                            document.querySelector('.cacheAppearDesapear').classList.remove('AnimationCache')
                        }, 1000)

                        setTimeout(function () {
                            document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';
                            document.querySelector('.bulleDialogue').style = "display: block;"
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
                        document.querySelector('.lecteur').innerHTML = rep[progress][0].Dialogues[number].Sentance
                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'startJeu2');
                        number = 0;
                    }
                    break;
                case "startJeu2":
                    window.location.href = "jeu/jeu2.html";
                    break;
                case 'Jeu2':
                    localStorage.setItem('menu', 'mapo');
                    document.querySelector('.bulleDialogue').style = "display: none;"
                    document.querySelector('.personnage1').style = "display: none;"
                    document.querySelector('.personnage2').style = "display: none;"
                    document.querySelector('.mapo').classList.add('ouvert')
                    document.querySelector('.categories').classList.remove('ouvert')
                    document.querySelector('.cache-black').classList.toggle('ouvert')
                    map.invalidateSize();
                    map.setView([latitude, longitude], 18);
                    break;
                case 'barrel':
                    if (number == 0) {
                        document.querySelector('.cacheAppearDesapear').style = 'display: block;';
                        document.querySelector('.cacheAppearDesapear').classList.add('AnimationCache');

                        setTimeout(function () {
                            document.querySelector('.cacheAppearDesapear').style = 'display: none;';
                            document.querySelector('.cacheAppearDesapear').classList.remove('AnimationCache')
                        }, 1000)

                        setTimeout(function () {
                            document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';
                            document.querySelector('.bulleDialogue').style = "display: block;"
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
                        document.querySelector('.lecteur').innerHTML = rep[progress][0].Dialogues[number].Sentance
                        number++;
                    }
                    if (number == rep[progress][0].Dialogues.length) {
                        localStorage.setItem('progress', 'startJeu3');
                        number = 0;
                    }
                    break;
                case "startJeu3":
                    window.location.href = "jeu/jeu3.html";
                    break;
                case "Jeu3":
                    if (number == 0) {
                        document.querySelector('.cacheAppearDesapear').style = 'display: block;';
                        document.querySelector('.cacheAppearDesapear').classList.add('AnimationCache')
                        setTimeout(function () {
                            document.querySelector('.cacheAppearDesapear').style = 'display: none;';
                            document.querySelector('.cacheAppearDesapear').classList.remove('AnimationCache')
                        }, 1000)

                        setTimeout(function () {
                            document.querySelector('.bgFixed>img').src = 'img/fond' + progress + '.jpg';
                            document.querySelector('.personnage1>img').src = 'img/personnages/' + rep[progress][0].CharacterOne + '.png'
                            document.querySelector('.personnage2>img').src = 'img/personnages/' + rep[progress][0].CharacterTwo + '.png'
                        }, 500)
                    }

                    if (number < rep[progress][0].Dialogues.length) {
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoTalk).classList.add('parler')
                        document.querySelector('.' + rep[progress][0].Dialogues[number].WhoDontTalk).classList.remove('parler')
                        print(rep[progress][0].Dialogues[number].Sentance)
                        document.querySelector('.lecteur').innerHTML = rep[progress][0].Dialogues[number].Sentance
                        number++;
                    }
                    break;
                default:
                    console.log('une erreur est survenue.')
            }
        })
}

// bloquer l'orientation

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

// partie mot de passe pour acceder a un jeu a distance

document.querySelectorAll('.jeux>a').forEach(e => {
    e.addEventListener('click', lancerJeu)
})

// lancer le jeu

function lancerJeu(event) {
    event.preventDefault();
    let mdp = document.querySelector('.recupCodeJeu').value

    if (mdp.toLowerCase() == 'mmi') {
        window.location.href = this.href
    }
    else {
        document.querySelector('.resultatJeu').innerHTML = 'Mot de passe incorrect'
    }
}