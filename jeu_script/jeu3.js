const draw = document.querySelector('#barile')

const ctx = draw.getContext('2d')

let H = window.innerHeight
let W = window.innerWidth


// le barile

let xBarile = (window.innerWidth / 2) - 175
let yBarile = 120
let yflotte = 160
let yBarileFront = 170

let xCentre = W / 2
let yCentre = 480

let aBarile = 0.001
let vBarile = 0;

let rotaleft = false;
let rotaright = false;

let angle = 0;

let aRedressement = 0;

let VitesseUtilisateur = 10 * 100;

function initialisation() {
    draw.width = window.innerWidth
    draw.height = window.innerHeight
}

window.addEventListener('deviceorientation', inclinaison_tel, true)

function inclinaison_tel(event){
    let alpha = event.alpha
    console.log(alpha)
    aRedressement = 0.001 * alpha;
}

function calculer() {
    let Random = parseInt(Math.random()*VitesseUtilisateur)

    if(Random == 1){
        let R2 = parseInt(Math.random()*10)

        if(R2 <= 4){
            rotaleft = true;
            rotaright = false;
        }

        if(R2 >= 5){
            rotaright = true;
            rotaleft = false;
        }
    }

    // if(rotaleft){
    //     vBarile -= aBarile;
    // }
    // if(rotaright){
    //     vBarile += aBarile;
    // }

    vBarile += aRedressement
    angle += vBarile
}

function afficher() {

    ctx.fillStyle = "#09C";
    ctx.fillRect(0, 0, W, H);

    function dessinerRectangle(yDéplacement, color, taille) {
        // Store the current context state (i.e. rotation, translation etc..)
        ctx.save()
        ctx.translate(xCentre, yCentre);
        //Rotate the canvas around the origin
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillStyle = color;
        ctx.fillRect(-350 / 2, yDéplacement - taille /2 , 350, taille)
        // Restore canvas state as saved from above
        ctx.restore();
    }

    dessinerRectangle(0, "#5b3c11", 650);  // Baril
    dessinerRectangle(20, "#FFFFF0", 610); // Ombre du baril
    dessinerRectangle(25, "#6b4c21", 600); // Avant du baril
}

function boucle() {
    calculer()
    afficher()

    window.requestAnimationFrame(boucle)
}

initialisation()
boucle()