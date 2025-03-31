const draw = document.querySelector('#barile')

const ctx = draw.getContext('2d')

let H = 0
let W = 0


// le barile 

let xBarile = (window.innerWidth / 2) - 175
let yBarile = 120
let yflotte = 160
let yBarileFront = 170

let xCentreBarile = (xBarile + 350) / 2
let yCentreBarile = (yBarile + 650) / 2

let vBarile = 0.5;

let angle = 0;



function initialisation() {
    H = window.innerHeight
    W = window.innerWidth

    draw.width = window.innerWidth
    draw.height = window.innerHeight
}


function calculer() {

}

function afficher() {

    ctx.fillStyle = "#09C";
    ctx.fillRect(0, 0, W, H);

    // Store the current context state (i.e. rotation, translation etc..)
    ctx.save()

    ctx.translate(W / 2, yBarile + 325);
    //Rotate the canvas around the origin
    ctx.rotate(45 * Math.PI / 180);

    ctx.fillStyle = "#5b3c11";
    ctx.fillRect(-350 / 2, -650 / 2, 350, 650)
    // Restore canvas state as saved from above


    ctx.fillStyle = "#FFFFF0"
    ctx.fillRect(-350 / 2, -610 / 2, 350, 610)

    ctx.fillStyle = "#6b4c21"
    ctx.fillRect(-350 / 2, -600 / 2, 350, 600)
    
    ctx.restore();


}

function boucle() {
    calculer()
    afficher()

    window.requestAnimationFrame(boucle)
}

initialisation()
boucle()