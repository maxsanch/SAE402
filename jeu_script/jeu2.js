let canvas_maisons = document.getElementById("maisons");
let canvas_route = document.getElementById("route");
let canvas_obstacles = document.getElementById("obstacles");
let canvas_perso = document.getElementById("perso");
let maisons = canvas_maisons.getContext("2d");
let route = canvas_route.getContext("2d");
let obstacles = canvas_obstacles.getContext("2d");
let perso = canvas_perso.getContext("2d");

// définit la taille de l'écran
ecrW = window.innerWidth;
ecrH = window.innerHeight;

// définit la taille des canvas
canvas_perso.width = ecrW;
canvas_perso.height = ecrH;
canvas_obstacles.width = ecrW;
canvas_obstacles.height = ecrH;
canvas_maisons.width = ecrW;
canvas_maisons.height = ecrH;
canvas_route.width = ecrW;
canvas_route.height = ecrH;

// initialisation des variables globales
var largeur = ecrW;
var hauteur = ecrH;
var gravité = 1;

// initialisation des variables de la route
var epaisseurRoute = 50;
var roadL = (largeur - 3 * epaisseurRoute) / 4; // position de la route à gauche
var roadM = roadL + epaisseurRoute + ((largeur - 3 * epaisseurRoute) / 4); // position de la route au milieu
var roadR = roadM + epaisseurRoute + (largeur - 3 * epaisseurRoute) / 4; // position de la route à droite
var CurrentRoad = 1; // position de la route actuelle (0 = gauche, 1 = milieu, 2 = droite)

// Ajout des positions des voies dans un tableau
var road = [roadL + epaisseurRoute / 2, roadM + epaisseurRoute / 2, roadR + epaisseurRoute / 2];

// initialisation des variables pour le personnage
var persoX = hauteur - 100; // position X du personnage à l'horizontale
var persoY = road[CurrentRoad]; // position Y du personnage à la verticale
var tailleX = 50; // taille du personnage à l'horizontale
var tailleY = 50; // taille du personnage à la verticale

// initialisation des variables de vitesse pour les obstacles / maisons
var spdObstc = 0;
var spdMais = 0;



//////////////////////////////////////////////////////////

// Fonction pour controler le personnage
function moveCharacter(direction) {
    if (direction === "left" && CurrentRoad > 0) {
        CurrentRoad--; // Déplace vers la voie de gauche
    } else if (direction === "right" && CurrentRoad < 2) {
        CurrentRoad++; // Déplace vers la voie de droite
    }
    persoY = road[CurrentRoad]; // Met à jour la position horizontale du personnage
}

// Gestion des événements du clavier
document.addEventListener("keydown", function (event) {
    if (event.key === "q" || event.key === "Q") {
        moveCharacter("left"); // Déplacement à gauche
    } else if (event.key === "d" || event.key === "D") {
        moveCharacter("right"); // Déplacement à droite
    }
});

/////////////////////////////////////////////////////////

function Afficher() {
    perso.clearRect(0, 0, largeur, hauteur);

    perso.fillStyle = "black";
    perso.fillRect(persoY - (tailleY / 2), persoX - (tailleX / 2), tailleY, tailleX);
    

    // affichage de la route
    route.clearRect(0, 0, largeur, hauteur);
    route.fillStyle = "gray";
    route.fillRect(roadL, 0, epaisseurRoute, hauteur);
    route.fillRect(roadM, 0, epaisseurRoute, hauteur);
    route.fillRect(roadR, 0, epaisseurRoute, hauteur);

    window.requestAnimationFrame(Afficher);
}

// Appel de la fonction pour l'afficher sur le site
Afficher();