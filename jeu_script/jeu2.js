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
let gravité = 0.05;

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
let obstacleExist = true; // variable pour vérifier si l'obstacle existe ou non

// initialisation des variables de vitesse pour les obstacles & maisons / ennemis
let spdObstc = 6;
let spdEnmy = 1;
let ennemiX = road[0]; // position X de l'ennemi à l'horizontale
let ennemiExist = true; // variable pour vérifier si l'ennemi existe ou non

// Initialisation d'une variable pour le score
let score = 0;
let viePlayer = 3; // Nombre de vies du joueur

// Initialisation de variable que j'ai plus envie de définir
let decideExist = 0; // Variable qui décide de qui va disparaître de notre réalité

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
        obstacleY + tailleY > persoX - tailleX / 2 && // Bas de l'obstacle atteint le haut du personnage
        obstacleY < persoX + tailleX / 2 &&          // Haut de l'obstacle atteint le bas du personnage
        ennemiX + tailleX / 2 > persoY - tailleY / 2 && // Droite de l'ennemi atteint la gauche du personnage
        ennemiX - tailleX / 2 < persoY + tailleY / 2    // Gauche de l'ennemi atteint la droite du personnage
    ) {
        console.log("Collision");
        collision = true; // Met à jour la variable de collision
        // Vous pouvez ajouter ici des actions à effectuer en cas de collision
        // Par exemple : réinitialiser le jeu, réduire des points de vie, etc.
    }
}

function clearScreen() {
    // Met tous les canvas en display none
    canvas_maisons.style.display = "none";
    canvas_route.style.display = "none";
    canvas_obstacles.style.display = "none";
    canvas_perso.style.display = "none";
}

function drawScore() {
    perso.font = "12px pixel"; // Définit la police et la taille du texte
    perso.fillStyle = "black"; // Définit la couleur du texte
    perso.fillText("Score: " + score + " Vie: " + viePlayer, 10, 20); // Affiche le score et la vue du personnage en haut à gauche
}

/////////////////////////////////////////////////////////

function Afficher() {
    perso.clearRect(0, 0, largeur, hauteur);
    obstacles.clearRect(0, 0, largeur, hauteur);
    route.clearRect(0, 0, largeur, hauteur);
    maisons.clearRect(0, 0, largeur, hauteur);
    // joueur
    perso.fillStyle = "black";
    perso.fillRect(persoY - (tailleY / 2), persoX - (tailleX / 2), tailleY, tailleX);
    // obstacle 1
    if (obstacleExist == true) {
        obstacles.fillStyle = "red";
        obstacles.fillRect(obstacleX - (tailleX / 2), obstacleY, tailleY, tailleX);
    }
    // obstacle 2
    if (ennemiExist == true) {
        obstacles.fillStyle = "orange";
        obstacles.fillRect(ennemiX - (tailleX / 2), obstacleY, tailleY, tailleX);
    }

    obstacleY += spdObstc; // Déplacement de l'obstacle vers le bas
    if (obstacleY > hauteur) {
        obstacleY = 0; // Réinitialise la position de l'obstacle
        obstacleX = road[Math.floor(Math.random() * 3)]; // Change la position de l'obstacle aléatoirement
        ennemiX = road[Math.floor(Math.random() * 3)]; // Change la position de l'obstacle aléatoirement
        if (collision === true) {
            viePlayer--; // Diminue le nombre de vies
            console.log("Score actuelle", score, "vie restante", viePlayer);
        }
        else {
            score++; // Augmente le score
            console.log("Score actuelle", score, "vie restante", viePlayer);
        }
        spdObstc += gravité; // Augmente la vitesse de l'obstacle
        spdEnmy += gravité; // Augmente la vitesse de l'ennemi
        console.log("Vitesse de l'obstacle", spdObstc, "Vitesse de l'ennemi", spdEnmy);
        decideExist = Math.floor(Math.random() * 2); // 0 ou 1 pour décider de qui va disparaître
        collision = false; // Réinitialise la variable de collision
        obstacleExist = true; // Réinitialise l'existence de l'obstacle
        ennemiExist = true; // Réinitialise l'existence de l'ennemi
        // score++; // Augmente le score
        // console.log(score);
    }
    if (ennemiX == obstacleX) { // Si l'ennemi et l'obstacle sont sur la même voie, on change la position de l'ennemi
        if (decideExist == 0) {
            obstacleExist = false; // L'obstacle n'existe plus
        }
        else {
            ennemiExist = false; // L'ennemi n'existe plus
        }
    }

    detectCollision(); // Vérifie les collisions
    drawScore(); // Affiche le score


    // affichage de la route
    route.clearRect(0, 0, largeur, hauteur);
    route.fillStyle = "gray";
    route.fillRect(roadL, 0, epaisseurRoute, hauteur);
    route.fillRect(roadM, 0, epaisseurRoute, hauteur);
    route.fillRect(roadR, 0, epaisseurRoute, hauteur);

    if (viePlayer <= 0) { // Si le joueur n'a plus de vies
        window.cancelAnimationFrame(Afficher); // Arrête l'animation si le joueur n'a plus de vies
        clearScreen(); // retire les canvass en les passant en display none
        if (score >= 30) {
            console.log("Vous avez gagné, Votre score est de " + score + " !"); // Affiche le message de victoire dans la console
            document.getElementsByClassName("écran_win")[0].style.display = "block"; // Affiche l'écran de victoire
            document.getElementsByClassName("écran_win")[0].innerHTML = "<h1>Vous avez gagné !</h1><p>Votre score est de " + score + "</p><button onclick=\"location.reload()\">Rejouer</button>"; // Affiche le message de victoire
        }
        else {
            console.log("Vous avez perdu, Votre score est de " + score + " ! Vous devez faire un score supérieur à 30 pour gagner."); // Affiche le message de défaite dans la console
            document.getElementsByClassName("écran_lose")[0].style.display = "block"; // Affiche l'écran de défaite
            document.getElementsByClassName("écran_lose")[0].innerHTML = "<h1>Vous avez perdu !</h1><p>Votre score est de " + score + "</p><button onclick=\"location.reload()\">Rejouer</button>"; // Affiche le message de défaite
        }
    }
    else {
        window.requestAnimationFrame(Afficher); // Continue l'animation si le joueur a encore des vies
    }
}

// Appel de la fonction pour l'afficher sur le site
Afficher();