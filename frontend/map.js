// יצירת המפה וקביעת מרכז (למשל ירושלים) וזום
var map = L.map('map').setView([31.7683, 35.2137], 13);

// טעינת המראה של המפה (OpenStreetMap)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.circleMarker(e.latlng).addTo(map)
        .bindPopup("אתה נמצא בטווח של " + radius + " מטרים מנקודה זו").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);