// initialisaion

let latitude = 0;
let longitude = 0;


if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        var map = L.map('map').setView([latitude, longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        L.Routing.control({
            waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(47.74696420259903, 7.333642888445753)
            ]
        }).addTo(map);
    }, function (erreur) {
        console.log(erreur)

        var map = L.map('map').setView([latitude, longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    })

    if (latitude != 0 && longitude != 0) {
        console.log(latitude)
    }
}
else {
    console.log("Géolocalisation non supportée");
    var map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

