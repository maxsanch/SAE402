var canvas_decor = document.getElementById("décor");
var canvas_obstacles = document.getElementById("obstacles");
var canvas_perso = document.getElementById("perso");
        var ctx = canvas.getContext("2d");

        // définit la taille de l'écran
        ecrW = window.innerWidth;
        ecrH = window.innerHeight;

        // définit la taille du canvas
        canvas.width = ecrW;
        canvas.height = ecrH;

        // initialisation des variables
        var hauteur = ecrW;
        var largeur = ecrH;


        var line = 0;
        var fact = 1;

        function AfficherFond() {
            ctx.clearRect(0, 0, hauteur, largeur);

            // rectangle jaune
            ctx.fillStyle = "blue"
            ctx.fillRect(0, 0, hauteur, largeur);

            window.requestAnimationFrame(AfficherFond);
        }

        // Appel de la fonction pour l'afficher sur le site
        AfficherFond();