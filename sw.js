/******************
	Pour mieux comprendre ce script, voir : https://css-tricks.com/serviceworker-for-offline/
*******************/

var version = 'v1:0:3';

self.addEventListener("install", function (event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(version + 'fundamentals')
			.then(function (cache) {
				return cache.addAll([
					'/',
					'index.html',
					'manifest.json',
					'videos/tutoriel-jeu-3.mp4',
					'styles/style.css',
					'js/dialogues.json',
					'js/script.js',
					'jeu_style/jeu1.css',
					'jeu_style/jeu2.css',
					'jeu_style/jeu3.css',
					'jeu_script/jeu1.js',
					'jeu_script/jeu2.js',
					'jeu_script/jeu3.js',
					'jeu/jeu1.html',
					'jeu/jeu2.html',
					'jeu/jeu3.html',
					'font/Daydream.ttf',
					'img/arrow_back.svg',
					'img/back-tonneau.png',
					'img/fond-jeu-3.jpg',
					'img/fond-jeu3-debut.jpg',
					'img/fondbar.jpg',
					'img/fondbarrel.jpg',
					'img/fondintro.jpg',
					'img/fondJeu3.jpg',
					'img/fondrun.jpg',
					'img/fondscene1.jpg',
					'img/front-tonneau.png',
					'img/plaine.png',
					'img/sky.jpg',
					'img/vide.png',
					'img/nuage-droite-1.png',
					'img/nuage-droite-2.png',
					'img/nuage-gauche-1.png',
					'img/nuage-gauche-2.png',
					'img/tonneau-tomber-droite/New Piskel-1.png',
					'img/tonneau-tomber-droite/New Piskel-2.png',
					'img/tonneau-tomber-droite/New Piskel-3.png',
					'img/tonneau-tomber-droite/New Piskel-4.png',
					'img/tonneau-tomber-droite/New Piskel-5.png',
					'img/tonneau-tomber-droite/New Piskel-6.png',
					'img/tonneau-tomber-droite/New Piskel-7.png',
					'img/tonneau-tomber-droite/New Piskel-8.png',
					'img/tonneau-tomber-gauche/New Piskel-1.png',
					'img/tonneau-tomber-gauche/New Piskel-2.png',
					'img/tonneau-tomber-gauche/New Piskel-3.png',
					'img/tonneau-tomber-gauche/New Piskel-4.png',
					'img/tonneau-tomber-gauche/New Piskel-5.png',
					'img/tonneau-tomber-gauche/New Piskel-6.png',
					'img/tonneau-tomber-gauche/New Piskel-7.png',
					'img/tonneau-tomber-gauche/New Piskel-8.png',
					'img/personnages/Barman.png',
					'img/personnages/Lambda.png',
					'img/personnages/Tanner.png',
					'img/personnages/Us.png',
					'img/iconeApp/icon-72x72.png',
					'img/iconeApp/icon-96x96.png',
					'img/iconeApp/icon-128x128.png',
					'img/iconeApp/icon-144x144.png',
					'img/iconeApp/icon-152x152.png',
					'img/iconeApp/icon-192x192.png',
					'img/iconeApp/icon-384x384.png',
					'img/iconeApp/icon-512x512.png',
					'audio/jeu3/Donkey Kong Country Music SNES - DK Island Swing.mp3',
					'audio/jeu3/tremblement.mp3',
					'audio/main_theme.mp3',
					'audio/jeu1/musique.mp3',
					'audio/jeu1/note3.mp3',
					'audio/jeu1/obstacle.mp3',
					'img/jeu1/bar_debut.jpg',
					'img/jeu1/bar.jpg',
					'img/jeu1/chaise.png',
					'img/jeu1/gambri.jpg',
					'img/jeu1/guitariste.png',
					'img/jeu1/homme.png',
					'img/jeu1/note_verte.png',
					'videos/tutoriel-jeu-1.mp4',
					'audio/jeu2/Crash.mp3',
					'audio/jeu2/Cri_cheval.mp3',
					'audio/jeu2/Cri_chèvre.mp3',
					'audio/jeu2/jumpscare.mp3',
					'audio/jeu2/Parée.mp3',
					'img/jeu2/Background_défaite.jpg',
					'img/jeu2/Background_lancement.jpg',
					'img/jeu2/Background_victoire.jpg',
					'img/jeu2/Ennemy.png',
					'img/jeu2/Maison.png',
					'img/jeu2/Obstacle1.png',
					'img/jeu2/Obstacle2.png',
					'img/jeu2/ObstacleCentral.png',
					'img/jeu2/Player.png',
					'img/jeu2/Route.png'
				]);
			})
	);
});

self.addEventListener("fetch", function (event) {
	if (event.request.url.indexOf('http') === 0 && event.request.method == 'GET') {
		event.respondWith(
			caches
				.match(event.request)
				.then(function (cached) {
					var networked = fetch(event.request)
						.then(fetchedFromNetwork, unableToResolve)
						.catch(unableToResolve);
					return cached || networked;

					function fetchedFromNetwork(response) {
						var cacheCopy = response.clone();
						caches.open(version + 'pages')
							.then(function add(cache) {
								cache.put(event.request, cacheCopy);
							});
						return response;
					}

					function unableToResolve() {

						return new Response("<h1>Cette ressource n'est pas disponible hors ligne</h1>", {
							status: 503,
							statusText: 'Service Unavailable',
							headers: new Headers({
								'Content-Type': 'text/html'
							})
						});
					}
				})
		);
	}
});

self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches
			.keys()
			.then(function (keys) {
				return Promise.all(
					keys
						.filter(function (key) {
							return !key.startsWith(version);
						})
						.map(function (key) {
							return caches.delete(key);
						})
				);
			})
	);
});