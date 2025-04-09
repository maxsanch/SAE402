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
let largeur = ecrW;
let hauteur = ecrH;
let gravité = 1;

// initialisation des variables de la route
let epaisseurRoute = 50;
let roadL = (largeur - 3 * epaisseurRoute) / 4; // position de la route à gauche
let roadM = roadL + epaisseurRoute + ((largeur - 3 * epaisseurRoute) / 4); // position de la route au milieu
let roadR = roadM + epaisseurRoute + (largeur - 3 * epaisseurRoute) / 4; // position de la route à droite
let CurrentRoad = 1; // position de la route actuelle (0 = gauche, 1 = milieu, 2 = droite)

// Ajout des positions des voies dans un tableau
let road = [roadL + epaisseurRoute / 2, roadM + epaisseurRoute / 2, roadR + epaisseurRoute / 2];

// initialisation des variables pour le personnage
let persoX = hauteur - 100; // position X du personnage à l'horizontale
let persoY = road[CurrentRoad]; // position Y du personnage à la verticale
let tailleX = 50; // taille du personnage à l'horizontale
let tailleY = 50; // taille du personnage à la verticale

// initialisation des variables pour les obstacles
let obstacleY = 0; // position Y de l'obstacle à la verticale
let obstacleX = road[CurrentRoad]; // position X de l'obstacle à l'horizontale


// initialisation des variables de vitesse pour les obstacles & maisons / ennemis
let spdObstc = 6;
let spdEnmy = 1;

// Initialisation d'une variable pour le score
let score = 0;

//////////////////////////////////////////////////////////

// Fonction pour controler le personnage
function moveCharacter(direction) {
    if (direction === "left" && CurrentRoad > 0) {
        CurrentRoad--; // Déplace vers la voie de gauche
        // console.log(CurrentRoad);
    } else if (direction === "right" && CurrentRoad < 2) {
        CurrentRoad++; // Déplace vers la voie de droite
        // console.log(CurrentRoad);
    }
    persoY = road[CurrentRoad]; // Met à jour la position horizontale du personnage
}

// Gestion des événements du clavier
document.addEventListener("keydown", function (event) {
    if (event.key === "q") {
        moveCharacter("left"); // Déplacement à gauche
    } else if (event.key === "d") {
        moveCharacter("right"); // Déplacement à droite
    }
});

/////////////////////////////////////////////////////////

function Afficher() {
    perso.clearRect(0, 0, largeur, hauteur);
    obstacles.clearRect(0, 0, largeur, hauteur);
    route.clearRect(0, 0, largeur, hauteur);
    maisons.clearRect(0, 0, largeur, hauteur);
    // joueur
    perso.fillStyle = "black"; 
    perso.fillRect(persoY - (tailleY / 2), persoX - (tailleX / 2), tailleY, tailleX);
    // obstacle
    obstacles.fillStyle = "red";
    obstacles.fillRect(obstacleX - (tailleX / 2), obstacleY, tailleY, tailleX);

    obstacleY += spdObstc; // Déplacement de l'obstacle vers le bas
    if (obstacleY > hauteur) {
        obstacleY = 0; // Réinitialise la position de l'obstacle
        obstacleX = road[Math.floor(Math.random() * 3)]; // Change la position de l'obstacle aléatoirement
    }
    

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