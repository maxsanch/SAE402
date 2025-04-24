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

// Chargement des sprites
let persoSprite = new Image();
persoSprite.src = "../img/jeu2/Player.png"; // Remplacez par le chemin de votre sprite pour le personnage

let obstacleSprite = new Image();
obstacleSprite.src = "../img/jeu2/Obstacle1.png"; // Remplacez par le chemin de votre sprite pour l'obstacle

let obstacle2Sprite = new Image();
obstacle2Sprite.src = "../img/jeu2/Obstacle2.png"; // Remplacez par le chemin de votre sprite pour l'obstacle 2

let ennemiSprite = new Image();
ennemiSprite.src = "../img/jeu2/Ennemy.png"; // Remplacez par le chemin de votre sprite pour l'ennemi

let obstacleCentralSprite = new Image();
obstacleCentralSprite.src = "../img/jeu2/ObstacleCentral.png"; // Remplacez par le chemin de votre sprite pour l'obstacle central

let maisonSprite = new Image();
maisonSprite.src = "../img/jeu2/Maison.png"; // Remplacez par le chemin de votre sprite pour les maisons

const routeImage = new Image();
routeImage.src = "../img/jeu2/Route.png"; // Remplacez par le chemin de votre image pour la route

// initialisation des variables globales
let largeur = ecrW;
let hauteur = ecrH;
let gravité = 0; // réellement initialisés dans la fonction Afficher

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

// initialisation des variables pour les obstacles & maisons
let obstacleY = 0; // position Y de l'obstacle à la verticale
let obstacle2Y = 0; // position Y de l'obstacle à la verticale
let obstacleX = road[CurrentRoad]; // position X de l'obstacle à l'horizontale
let obstacle2X = road[0]; // position X de l'obstacle 2 à l'horizontale
let obstacleExist = true; // variable pour vérifier si l'obstacle existe ou non
let obstacle2Exist = true; // variable pour vérifier si l'obstacle 2 existe ou non
let spdObstc = 0; // réellement initialisés dans la fonction Afficher

// initialisation des variables de vitesse pour les obstacles & maisons / ennemis
let ennemiY = 0; // position Y de l'ennemi à la verticale
let spdEnmy = 0; // réellement initialisés dans la fonction Afficher
let ennemiX = road[0]; // position X de l'ennemi à l'horizontale
let ennemiExist = false; // variable pour vérifier si l'ennemi existe ou non

// Initialisation d'une variable pour le score
let score = 0;
let viePlayer = 3; // Nombre de vies du joueur

// Initialisation de variable que j'ai plus envie de définir
let decideExist = 0; // Variable qui décide de qui va disparaître de notre réalité
let RedefineVar = 0; // Variable pour redéfinir la variable vu que ça marche pas

// Initialisation des variables pour faire en sorte que le le jeux ne dépende pas des frames mais du temps
let Tstart = performance.now(); // Temps de départ
let Tnow = 0; // Temps actuel
let Dtemp = 0; // différence de temps entre le temps de départ et le temps actuel 
let RedefineTime = 0; // Variable pour redéfinir le temps vu que ça marche pas

// Initialisation des phases de jeux
let tempsPhaseMax = 0; // Durée de la phase actuelle
let phasesJeux = [
    { gravité: 5, spdObstc: 250, spdEnmy: 0, spdMaisons: 260, obstacleExist: true, obstacle2Exist: true, ennemiExist: false, tempsPhaseMax: 7 - 1 }, // Phase 1 (le -1 c'est parce que le jeux fait que la première phase est plus longue de 1 et j'ai la flemme de chercher à le résoudre autrement)
    { gravité: 10, spdObstc: 250, spdEnmy: 250, spdMaisons: 260, obstacleExist: false, obstacle2Exist: false, ennemiExist: true, tempsPhaseMax: 3 }, // Phase 2
    { gravité: 5, spdObstc: 250, spdEnmy: 300, spdMaisons: 310, obstacleExist: true, obstacle2Exist: true, ennemiExist: true, tempsPhaseMax: Infinity } // Phase 3
];
let phaseActuelle = 0; // Phase actuelle du jeu
let phaseMontrer = 1; // Phase actuelle du jeu affichée à l'écran
let tempsPhase = 0; // Temps écoulé dans la phase actuelle

// Initialisation de variables pour que le déplacement avec le senseur soit agréable
let lastMoveTime = 0; // Dernier temps de mouvement
let moveDelay = 200; // Délai entre les mouvements (en millisecondes)
let currentMoveTime = 0; // Temps actuel

// Initialisation des variables pour les maisons
const nbMaisons = 6; // Nombre de maisons de chaque côté
const maisonsGauche = []; // Positions des maisons à gauche
const maisonsDroite = []; // Positions des maisons à droite
let spdMaisons = 100; // Vitesse des maisons (modifiable)

// Initialisation des positions des maisons
for (let i = 0; i < nbMaisons; i++) {
    maisonsGauche.push({ x: 0, y: -i * 200 }); // Position initiale des maisons à gauche
    maisonsDroite.push({ x: largeur - 50, y: -i * 200 }); // Position initiale des maisons à droite
}

// Initialisation des différents sons jouées dans le jeux
// let sonCollision = new Audio("../audio/jeu2/Collision.mp3"); // Son de collision
// let sonParade = new Audio("../audio/jeu2/Parade.mp3"); // Son de parade
// let sonMusiqueJeux = new Audio("../audio/jeu2/Jeux.mp3"); // Son du jeu
// let sonCheval = new Audio("../audio/jeu2/Cheval.mp3"); // Son du cheval
// let sonChèvre = new Audio("../audio/jeu2/Chèvre.mp3"); // Son de la chèvre
// let sonMeme = new Audio("../audio/jeu2/Meme.mp3"); // Son d'un meme

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
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

    // Vérifie si un obstacle ou un ennemi est présent
    if (obstacleExist || obstacle2Exist || ennemiExist) {
        moveSound.currentTime = 0; // Réinitialise le son pour qu'il puisse être rejoué
        moveSound.play(); // Joue le son
    }
}

// Gestion des événements du clavier (pour la correction ou le teste sur pc vu que controler avec le senseur c'est pas évident)
document.addEventListener("keydown", function (event) {
    if (event.key === "q" || event.key === "Q" || event.key === "ArrowLeft") {
        moveCharacter("left"); // Déplacement à gauche
    } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        moveCharacter("right"); // Déplacement à droite
    }
});

// Gestion des événements de l'accéléromètre (pour le mobile)
window.addEventListener("deviceorientation", function (event) {
    const gamma = event.gamma; // Inclinaison gauche-droite (en degrés)
    currentMoveTime = this.performance.now(); // Temps actuel

    // Vérifie si le délai minimal est respecté
    if (currentMoveTime - lastMoveTime > moveDelay) {
        // Déplace le personnage à gauche si l'inclinaison est inférieure à -20 degrés
        if (gamma < -20 && CurrentRoad > 0) {
            moveCharacter("left");
            lastMoveTime = currentMoveTime; // Met à jour le temps du dernier déplacement
        }

        // Déplace le personnage à droite si l'inclinaison est supérieure à 20 degrés
        if (gamma > 20 && CurrentRoad < 2) {
            moveCharacter("right");
            lastMoveTime = currentMoveTime; // Met à jour le temps du dernier déplacement
        }
    }
});

let collision = false; // Variable pour vérifier la collision

// Fonction pour détecter les collisions
function detectCollision() {
    // Vérifie si les zones du personnage et de l'obstacle se chevauchent
    if (
        // colision rouge
        obstacleY + tailleY > persoX - tailleX / 2 && // Bas de l'obstacle atteint le haut du personnage
        obstacleY < persoX + tailleX / 2 &&          // Haut de l'obstacle atteint le bas du personnage
        obstacleX + tailleX / 2 > persoY - tailleY / 2 && // Droite de l'obstacle atteint la gauche du personnage
        obstacleX - tailleX / 2 < persoY + tailleY / 2    // Gauche de l'obstacle atteint la droite du personnage
        ||
        // colision orange
        obstacle2Y + tailleY > persoX - tailleX / 2 && // Bas de l'obstacle atteint le haut du personnage
        obstacle2Y < persoX + tailleX / 2 &&          // Haut de l'obstacle atteint le bas du personnage
        obstacle2X + tailleX / 2 > persoY - tailleY / 2 && // Droite de l'ennemi atteint la gauche du personnage
        obstacle2X - tailleX / 2 < persoY + tailleY / 2    // Gauche de l'ennemi atteint la droite du personnage
        ||
        // colision bleu
        obstacleCentralY + tailleY > persoX - tailleX / 2 && // Bas de l'obstacle atteint le haut du personnage
        obstacleCentralY < persoX + tailleX / 2 &&          // Haut de l'obstacle atteint le bas du personnage
        obstacleCentralX + tailleX / 2 > persoY - tailleY / 2 && // Droite de l'obstacle atteint la gauche du personnage
        obstacleCentralX - tailleX / 2 < persoY + tailleY / 2    // Gauche de l'obstacle atteint la droite du personnage
    ) {
        // console.log("Collision");
        collision = true; // Met à jour la variable de collision
    }
}

let collisionEnnemi = false; // Variable pour vérifier la collision avec l'ennemi
let parade = false; // Variable pour vérifier si le joueur a paré l'ennemi

function detectCollisionEnnemi() {
    if (
        // colision verte
        ennemiY + tailleY > persoX - tailleX / 2 && // Bas de l'ennemi atteint le haut du personnage
        ennemiY < persoX + tailleX / 2 &&          // Haut de l'ennemi atteint le bas du personnage
        CurrentRoad === 1 // Vérifie si le personnage est au milieu de la route
    ) {
        // console.log("CollisionEnnemy");
        collisionEnnemi = true; // Met à jour la variable de collision
        document.addEventListener("click", function parer(event) {
            // Vérifie si le joueur est toujours dans la boîte de collision de l'ennemi
            if (
                ennemiY + tailleY > persoX - tailleX / 2 &&
                ennemiY < persoX + tailleX / 2 &&
                CurrentRoad === 1 // Vérifie si le personnage est au milieu de la route
            ) {
                parade = true; // Le joueur a paré l'ennemi
                console.log("Parade réussie !");
            }

            // Supprime l'écouteur après le clic
            document.removeEventListener("click", parer);
        });
    }
    else if (
        // colision verte
        ennemiY + tailleY > persoX - tailleX / 2 && // Bas de l'ennemi atteint le haut du personnage
        ennemiY < persoX + tailleX / 2 &&          // Haut de l'ennemi atteint le bas du personnage
        ennemiX + tailleX / 2 > persoY - tailleY / 2 && // Droite de l'ennemi atteint la gauche du personnage
        ennemiX - tailleX / 2 < persoY + tailleY / 2    // Gauche de l'ennemi atteint la droite du personnage
    ) {
        collision = true; // Met à jour la variable de collision
        console.log("Parade échouée !"); // Le joueur n'a pas paré l'ennemi
    }
}

function clearScreen() {
    // Met tous les canvas en display none
    canvas_maisons.style.display = "none";
    canvas_route.style.display = "none";
    canvas_obstacles.style.display = "none";
    canvas_perso.style.display = "none";
}

// écrit le score et la vie du joueur en canvas
function drawScore() {
    perso.font = "12px pixel"; // Définit la police et la taille du texte
    perso.fillStyle = "gold"; // Définit la couleur du texte
    perso.fillText("Score: " + score, 10, 20);
    perso.fillStyle = "red"; // Définit la couleur du texte
    perso.fillText("Vie: " + viePlayer, 10, 40);
    perso.fillStyle = "green"; // Définit la couleur du texte
    perso.fillText("Phase actuelle: " + phaseMontrer, 10, 60);
    if (parade == true) { // Si le joueur a paré l'ennemi
        perso.font = "30px pixel"; // Définit la police et la taille du texte
        perso.fillStyle = "red"; // Définit la couleur du texte
        perso.fillText("Parry", (ecrW / 2) - 80, ecrH / 2);
    }
}

function updatePhase() {
    tempsPhase += 1; // Incrémente le temps de la phase actuelle
    if (tempsPhase > phasesJeux[phaseActuelle].tempsPhaseMax) { // Si le temps de la phase actuelle est écoulé
        score--; // Diminue le score à chaque phase vu qu'il augmente de 2 à chaque changement et je comprend pas pourquoi
        tempsPhase = 0; // Réinitialise le temps de la phase actuelle
        phaseActuelle += 1; // Passe à la phase suivante
        phaseMontrer += 1; // Passe à la phase suivante affichée à l'écran
        RedefineVar = 0; // Réinitialise la variable pour redéfinir les autres variables dans afficher
        if (phaseActuelle >= phasesJeux.length) { // Si toutes les phases sont écoulées
            phaseActuelle = phasesJeux.length - 1; // Réinitialise la phase actuelle
        }
    }
}

let decideEnemyLane = 0; // Voie de l'ennemi (0 = gauche, 2 = droite)
let obstacleCentralY = 0; // Position Y de l'obstacle central
let obstacleCentralX = road[1]; // Position X de l'obstacle central
let spdObstcCentral = 0; // Vitesse de l'obstacle central
let obstacleCentralExist = false; // Variable pour vérifier si l'obstacle central existe ou non
let decidePatern = Math.floor(Math.random() * 3); // permet de mettre un patern aléatoire pour les obstacles et l'ennemi
let conditionObstCentral = false; // Variable pour vérifier si l'obstacle est en bas pour la boucle dans Afficher

function placeEnemyAndObstacle() {
    // Place l'ennemi aléatoirement sur la voie de gauche ou de droite
    decideEnemyLane = Math.random() < 0.5 ? 0 : 2; // 0 = gauche, 2 = droite
    ennemiX = road[decideEnemyLane];

    // Place un obstacle sur la voie restante
    if (decideEnemyLane == 0) {
        if (decideExist == 0) {
            obstacle2X = road[2]; // Si l'ennemi est à gauche, place l'obstacle 2 à droite
        }
        else {
            obstacleX = road[2]; // Si l'ennemi est à gauche, place l'obstacle à droite
        }
    }
    else {
        if (decideExist == 0) {
            obstacle2X = road[0]; // Si l'ennemi est à gauche, place l'obstacle 2 à droite
        }
        else {
            obstacleX = road[0]; // Si l'ennemi est à gauche, place l'obstacle à droite
        }
    }

    if (phaseActuelle === 2 && decidePatern == 2) { // Si on est en phase 3 et que le patern est 2, on place l'obstacle central
        obstacleCentralY = 0; // Réinitialise la position Y de l'obstacle central
        spdObstcCentral += gravité; // Augmente la vitesse de l'obstacle central
        obstacleCentralExist = true; // L'obstacle central existe
    }
    else {
        obstacleCentralExist = false; // L'obstacle central n'existe pas
    }
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function Afficher() {

    if (RedefineVar <= 20) {
        Tnow = performance.now(); // Temps actuel
        Dtemp = (Tnow - Tstart) / 1000; // Différence de temps entre le temps de départ et le temps actuel
        Tstart = Tnow; // Met à jour le temps de départ
        gravité = phasesJeux[phaseActuelle].gravité * Dtemp; // Met à jour la gravité en fonction du temps écoulé
        spdObstc = phasesJeux[phaseActuelle].spdObstc * Dtemp; // Met à jour la vitesse de l'obstacle en fonction du temps écoulé
        spdObstcCentral = (phasesJeux[phaseActuelle].spdObstc - 20) * Dtemp; // Met à jour la vitesse de l'obstacle central en fonction du temps écoulé
        spdEnmy = phasesJeux[phaseActuelle].spdEnmy * Dtemp; // Met à jour la vitesse de l'ennemi en fonction du temps écoulé
        RedefineTime += 1; // Met à jour la variable pour ne pas redéfinir le temps à chaque frame
        console.log("ça marche");
        RedefineVar += 1; // Met à jour la variable pour ne pas redéfinir le temps à chaque frame
        if (phaseActuelle == 0) { // Si on est en phase 1
            spdMaisons = 310 * Dtemp; // Met à jour la vitesse des maisons
        }
    }

    perso.clearRect(0, 0, largeur, hauteur);
    obstacles.clearRect(0, 0, largeur, hauteur);
    route.clearRect(0, 0, largeur, hauteur);
    maisons.clearRect(0, 0, largeur, hauteur);

    // joueur
    perso.drawImage(persoSprite, persoY - tailleY / 2, persoX - tailleX / 2, tailleY, tailleX);

    // obstacle 1
    if (obstacleExist == true) {
        obstacles.drawImage(obstacleSprite, obstacleX - tailleX / 2, obstacleY, tailleY, tailleX);
    }
    // obstacle 2
    if (obstacle2Exist == true) {
        obstacles.drawImage(obstacle2Sprite, obstacle2X - tailleX / 2, obstacle2Y, tailleY, tailleX);
    }

    // Affichage de l'obstacle central (uniquement en phase 3)
    if (obstacleCentralExist) {
        obstacles.drawImage(obstacleCentralSprite, obstacleCentralX - tailleX / 2, obstacleCentralY, tailleY, tailleX);
    }

    // ennemi
    if (ennemiExist == true) {
        obstacles.drawImage(ennemiSprite, ennemiX - tailleX / 2, ennemiY, tailleY, tailleX);
    }

    // déplacement des éléments
    if (obstacleExist == true) { // Si l'obstacle existe
        obstacleY += spdObstc; // Déplacement de l'obstacle vers le bas
    }
    if (obstacle2Exist == true) { // Si l'obstacle 2 existe
        obstacle2Y += spdObstc; // Déplacement de l'obstacle 2 vers le bas
    }
    if (ennemiExist == true) { // Si l'ennemi existe
        ennemiY += spdEnmy; // Déplacement de l'ennemi vers le bas
    }
    if (obstacleCentralExist) { // Si l'obstacle central existe
        obstacleCentralY += spdObstcCentral; // Déplacement de l'obstacle central vers le bas
    }

    if (obstacleCentralExist == false) {
        conditionObstCentral = true; // Si l'obstacle central n'existe pas, on met la condition à true
    }
    else {
        if (obstacleCentralY > hauteur + tailleY) { // Si l'obstacle central sort de l'écran
            conditionObstCentral = true; // On remet la condition à true
        }
    }

    maisons.clearRect(0, 0, largeur, hauteur);

    // Dessin des maisons
    for (let i = 0; i < nbMaisons; i++) {
        // Maisons à gauche
        maisons.drawImage(maisonSprite, maisonsGauche[i].x, maisonsGauche[i].y, 50, 50);

        // Maisons à droite
        maisons.drawImage(maisonSprite, maisonsDroite[i].x, maisonsDroite[i].y, 50, 50);
    }

    // Déplacement des maisons
    for (let i = 0; i < nbMaisons; i++) {
        maisonsGauche[i].y += spdMaisons; // Déplacement des maisons à gauche
        maisonsDroite[i].y += spdMaisons; // Déplacement des maisons à droite

        // Réinitialisation des maisons lorsqu'elles sortent de l'écran
        if (maisonsGauche[i].y > hauteur) {
            maisonsGauche[i].y = -200; // Réinitialise la position en haut
        }
        if (maisonsDroite[i].y > hauteur) {
            maisonsDroite[i].y = -200; // Réinitialise la position en haut
        }
    }

    if (conditionObstCentral == true && obstacleY > hauteur + tailleY || conditionObstCentral == true && obstacle2Y > hauteur + tailleY) { // Si l'obstacle sort de l'écran
        // console.log("Dtemp", Dtemp, "| Tnow", Tnow, "| Tstart", Tstart);
        conditionObstCentral = false; // On remet la condition à false
        updatePhase(); // Met à jour la phase de jeu
        obstacleY = 0; // Réinitialise la position de l'obstacle
        obstacle2Y = 0; // Réinitialise la position de l'obstacle
        ennemiY = 0; // Réinitialise la position de l'ennemi
        obstacleX = road[Math.floor(Math.random() * 3)]; // Change la position de l'obstacle aléatoirement
        obstacle2X = road[Math.floor(Math.random() * 3)]; // Change la position de l'obstacle aléatoirement
        if (collisionEnnemi === true) {
            if (parade === true) { // Si le joueur a paré l'ennemi
                score++; // Augmente le score
            }
            else { // Si le joueur n'a plus de vies
                viePlayer--; // Diminue le nombre de vies
                // console.log("Score actuelle", score, "vie restante", viePlayer);
            }
        }
        collisionEnnemi = false; // Réinitialise la variable de collision avec l'ennemi
        parade = false; // Réinitialise la variable de parade
        if (collision == true) { // Si le joueur a touché un obstacle
            viePlayer--; // Diminue le nombre de vies
            // console.log("Score actuelle", score, "vie restante", viePlayer);
        }
        else {
            score++; // Augmente le score
            // console.log("Score actuelle", score, "vie restante", viePlayer);
        }

        spdObstc += gravité; // Augmente la vitesse de l'obstacle
        spdEnmy += gravité; // Augmente la vitesse de l'ennemi
        // console.log("Vitesse de l'obstacle", spdObstc, "Vitesse de l'ennemi", spdEnmy);
        decideExist = Math.floor(Math.random() * 2); // 0 ou 1 pour décider de qui va disparaître
        collision = false; // Réinitialise la variable de collision
        obstacleExist = phasesJeux[phaseActuelle].obstacleExist; // Réinitialise l'existence de l'obstacle
        obstacle2Exist = phasesJeux[phaseActuelle].obstacle2Exist; // Réinitialise l'existence de l'obstacle 2
        ennemiExist = phasesJeux[phaseActuelle].ennemiExist; // Réinitialise l'existence de l'ennemi

        // Phase 2
        if (ennemiExist == true && phaseActuelle == 1) {
            placeEnemyAndObstacle(); // Place l'ennemi et l'obstacle
            if (decideExist == 0) {
                obstacle2Exist = true; // L'obstacle 2 n'existe plus
            }
            else {
                obstacleExist = true; // L'obstacle n'existe plus
            }
        }

        // Phase 3
        if (ennemiExist == true && phaseActuelle == 2) {
            if (decidePatern == 0) { // Si le patern est 0, on place les obstacles
                obstacleExist = true; // L'obstacle existe
                obstacle2Exist = true; // L'obstacle 2 existe
                obstacleCentralExist = false; // L'obstacle central n'existe pas
                ennemiExist = false; // L'ennemi n'existe pas
            }
            if (decidePatern == 1) { // Si le patern est 1, on place l'obstacle 2
                obstacleExist = false; // L'obstacle n'existe pas
                obstacle2Exist = false; // L'obstacle 2 n'existe pas
                ennemiExist = true; // L'ennemi existe
                obstacleCentralExist = false
                placeEnemyAndObstacle(); // Place l'ennemi et l'obstacle
                if (decideExist == 0) {
                    obstacle2Exist = true; // L'obstacle 2 n'existe plus
                }
                else {
                    obstacleExist = true; // L'obstacle n'existe plus
                }
            }
            if (decidePatern == 2) { // Si le patern est 2, on place l'obstacle 2
                obstacleExist = false; // L'obstacle n'existe pas
                obstacle2Exist = false; // L'obstacle 2 n'existe pas
                ennemiExist = true; // L'ennemi existe
                obstacleCentralExist = true; // L'obstacle central existe
                placeEnemyAndObstacle(); // Place l'ennemi et l'obstacle
                if (decideExist == 0) {
                    obstacle2Exist = true; // L'obstacle 2 n'existe plus
                }
                else {
                    obstacleExist = true; // L'obstacle n'existe plus
                }
            }
            decidePatern = Math.floor(Math.random() * 3); // Change le patern aléatoirement
        }
        // score++; // Augmente le score
        // console.log(score);
    }

    if (obstacle2X == obstacleX) { // Si l'ennemi et l'obstacle sont sur la même voie, on change la position de l'ennemi
        if (decideExist == 0) {
            obstacleExist = false; // L'obstacle n'existe plus
        }
        else {
            obstacle2Exist = false; // L'ennemi n'existe plus
        }
    }

    detectCollision(); // Vérifie les collisions
    detectCollisionEnnemi(); // Vérifie les collisions avec l'ennemi
    drawScore(); // Affiche le score


    // Affichage de la route
    route.clearRect(0, 0, largeur, hauteur);

    // Dessin de l'image de la route
    route.drawImage(routeImage, 0, 0, largeur, hauteur);

    // Ajuster l'opacité des rectangles
    route.globalAlpha = 0.3; // Définit l'opacité des rectangles (0.5 = 50% d'opacité)
    route.fillStyle = "gray";
    route.fillRect(roadL, 0, epaisseurRoute, hauteur);
    route.fillRect(roadM, 0, epaisseurRoute, hauteur);
    route.fillRect(roadR, 0, epaisseurRoute, hauteur);

    // Réinitialiser l'opacité pour les autres dessins
    route.globalAlpha = 1.0;

    if (viePlayer <= 0) { // Si le joueur n'a plus de vies
        window.cancelAnimationFrame(Afficher); // Arrête l'animation si le joueur n'a plus de vies
        clearScreen(); // retire les canvass en les passant en display none
        if (score >= 30) {
            // console.log("Vous avez gagné, Votre score est de " + score + " !"); // Affiche le message de victoire dans la console
            localStorage.setItem('progress', 'Jeu2');
            document.getElementsByClassName("écran_win")[0].style.display = "block"; // Affiche l'écran de victoire
            document.getElementsByClassName("écran_win")[0].innerHTML = `
        <h1>Vous avez gagne !</h1>
        <p>Votre score est de ${score}</p>
        <div>
            <button onclick="location.reload()">Rejouer</button>
            <button onclick="window.location.href='../index.html'">Retour à l'index</button>
        </div>
    `; // Affiche le message de victoire
        }
        else {
            // console.log("Vous avez perdu, Votre score est de " + score + " ! Vous devez faire un score supérieur à 30 pour gagner."); // Affiche le message de défaite dans la console
            document.getElementsByClassName("écran_lose")[0].style.display = "block"; // Affiche l'écran de défaite
            document.getElementsByClassName("écran_lose")[0].innerHTML = "<h1>Vous avez perdu !</h1><p>Votre score est de " + score + "</p><div onclick=\"location.reload()\">Rejouer</div>"; // Affiche le message de défaite
        }
    }
    else {
        window.requestAnimationFrame(Afficher); // Continue l'animation si le joueur a encore des vies
    }
}

// Appel de la fonction pour l'afficher sur le site
// Afficher();

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Cheat code pour gagner directement
const cheatCode = "MMI"; // Définissez le cheat code ici (EN MAJUSCULES)

// Écouteur pour détecter l'entrée du cheat code
document.getElementById("cheatCodeInput").addEventListener("input", function (event) {
    const input = event.target.value.toUpperCase(); // Convertit l'entrée en majuscules pour éviter les erreurs de casse

    if (input === cheatCode) {
        // Gagne directement la partie
        document.getElementById("cheatCodeInput").value = ""; // Réinitialise le champ de saisie
        document.getElementById("start-Screen").style.display = "none"; // Cache le champ de saisie
        Cheater(); // Appelle la fonction pour gagner
    }
});

// Fonction pour gagner directement
function Cheater() {
    window.cancelAnimationFrame(Afficher); // Arrête l'animation
    clearScreen(); // Cache les canvas
    localStorage.setItem('progress', 'Jeu2'); // Sauvegarde la progression
    document.getElementsByClassName("écran_win")[0].style.display = "block"; // Affiche l'écran de victoire
    document.getElementsByClassName("écran_win")[0].innerHTML = `
        <h1>Vous avez gagne !</h1>
        <p>Cheat code active</p>
        <div>
            <button onclick="location.reload()">Rejouer</button>
            <button onclick="window.location.href='../index.html'">Retour à l'index</button>
        </div>
    `;
}

// Fonction pour afficher l'écran de lancement

let startScreen = document.getElementById("start-Screen"); // Écran de lancement
let startButton = document.getElementById("startGame"); // Bouton de démarrage
startGame.addEventListener("click", function () {
    startScreen.style.display = "none"; // Cache l'écran de lancement
    Afficher(); // Démarre le jeu
});