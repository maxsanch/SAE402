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

// définit la taille du canvas
canvas_perso.width = ecrW;
canvas_perso.height = ecrH;
canvas_obstacles.width = ecrW;
canvas_obstacles.height = ecrH;
canvas_maisons.width = ecrW;
canvas_maisons.height = ecrH;
canvas_route.width = ecrW;
canvas_route.height = ecrH;

// initialisation des variables
var largeur = ecrW;
var hauteur = ecrH;

// initialisation des variables pour le personnage
var persoX = 0; // position X du personnage à l'horizontale
var persoY = 0; // position Y du personnage à la verticale

// initialisation des variables de la route
var roadL = 0;
var roadM = 0;
var roadR = 0;
var spdRoute = 0;

// initialisation des variables de vitesse pour les obstacles / maisons
var spdObstc = 0;
var spdMais = 0;

// persoY = ecrW * 0.2;
persoY = ecrW * 0.4;
// persoY = ecrW * 0.2;

function AfficherPerso() {
    perso.clearRect(0, 0, largeur, hauteur);

    perso.fillStyle = "black";
    perso.fillRect(persoY, persoX, 50, 50);

    window.requestAnimationFrame(AfficherPerso);
}

// Appel de la fonction pour l'afficher sur le site
AfficherPerso();