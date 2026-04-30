//הגדרות מפה ומיקום נוכחי של המחובר

// יצירת המפה וקביעת מרכז (ירושלים) וזום
var map = L.map('map').setView([31.7683, 35.2137], 13);

// טעינת המראה של המפה 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.circleMarker(e.latlng).addTo(map)
        .bindPopup("אני").openPopup();
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

//הצגת התלמידות

// פונקציה להמרת DMS לערך עשרוני
function convertDMSToDecimal(dms) {
    return parseFloat(dms.Degrees) + (parseFloat(dms.Minutes) / 60) + (parseFloat(dms.Seconds) / 3600);
}

// פונקציה להצגת תלמידה מה-JSON
function addStudentToMap(student) {
    const lat = convertDMSToDecimal(student.Coordinates.Latitude);
    const lng = convertDMSToDecimal(student.Coordinates.Longitude);

    L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: "#188331",
        color: "#fff",
        weight: 2,
        fillOpacity: 0.9
    }).addTo(map)
      .bindPopup("תלמידה: " + student.ID + "<br>זמן עדכון: " + student.Time);
}

// קבוצת שכבות כדי שנוכל לנקות את המפה לפני כל עדכון
var studentsLayer = L.featureGroup().addTo(map);

async function refreshStudents() {
    try {
        const response = await fetch('/api/students/all-locations');
        const locations = await response.json();

        // --- בדיקה---
        console.log("הנתונים שהתקבלו מהשרת:", locations); 
        // ---------------------------------

        // ניקוי המפה ממיקומים ישנים
        studentsLayer.clearLayers();

        // מעבר על כל התלמידות שהתקבלו ועדכונן על המפה
        locations.forEach(student => {
          if (student && student.coordinates) {
            const lat = convertDMSToDecimal(student.coordinates.Latitude);
            const lng = convertDMSToDecimal(student.coordinates.Longitude);

            L.circleMarker([lat, lng], {
                radius: 8,
                fillColor: "#188331",
                color: "#fff",
                weight: 2,
                fillOpacity: 0.9
            })
            .addTo(studentsLayer) // הוספה לשכבה במקום ישירות למפה
            .bindPopup("תלמידה: " + student.id + "<br>זמן עדכון: " + student.time);
          }
        });
    } catch (err) {
        console.error("שגיאה במשיכת נתונים:", err);
    }

}
// קריאה ראשונה והגדרת רענון כל 60 שניות
refreshStudents();
setInterval(refreshStudents, 60000);


// - כשיש תלמידה מתאים את המפה שכולם יכנסו
function zoomToAll() {
    if (studentsLayer.getLayers().length > 0) {
        map.fitBounds(studentsLayer.getBounds(), { padding: [30, 30] });
    }
}
//בדיקה
//L.marker([50.5, 30.5]).addTo(map);//הוספת אוביקט למפה


//function(geoJsonPoint, latlng) {// מקורדינטות(DD) לאוביקט מפה
//    return L.marker(latlng);
//}

//JSON.parse()// מ-JSON ל-JS
//JSON.stringify()// מ-JS ל-JSON

//const myJSON = '{"name":"John", "age":31, "city":"New York"}';
//const myObj = JSON.parse(myJSON);
//document.getElementById("demo").innerHTML = myObj.name;
