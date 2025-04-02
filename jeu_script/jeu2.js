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

// initialisation des variables
var largeur = ecrW;
var hauteur = ecrH;

var line = 0;
var fact = 1;

function AfficherFond() {
    // Utilisation du contexte 'perso'
    perso.clearRect(0, 0, largeur, hauteur);

    // rectangle de couleur
    perso.fillStyle = "red";
    perso.fillRect(0, 0, largeur, hauteur);

    window.requestAnimationFrame(AfficherFond);
}

// Appel de la fonction pour l'afficher sur le site
AfficherFond();