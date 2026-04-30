
document.addEventListener('DOMContentLoaded', async () => {
    // שליפת אובייקט המשתמש ופירוקו מפורמט טקסט לאובייקט JS
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const loggedIn = document.getElementById('in');
    const loggedOut = document.getElementById('out');
    const nameSpan = document.getElementById('user-display-name');
    const table = document.getElementById('studentsTable');
    const Smap = document.getElementById('Smap');

    if (user) {
        // אם קיים משתמש - נציג את אזור המחוברים
        loggedIn.style.display = 'block';
        loggedOut.style.display = 'none';
        
        // עדכון השם בתצוגה
        if (nameSpan) nameSpan.textContent = user.first_name;

        // בדיקת הרשאה שהמורה תראה את הטבלה והמפה
        if (user.role === 'מורה') {
            loadStudents(user.id);
        } else {
            table.style.display = 'none';
            Smap.style.display = 'none';
        }
    } else {
        loggedIn.style.display = 'none';
        loggedOut.style.display = 'block';
    }
});

async function loadStudents(teacherId) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/teacher/${teacherId}`);
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = ""; // ניקוי הטבלה לפני מילוי

        students.forEach(student => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.first_name}</td>
                <td>${student.last_name}</td>
            `;
        });
    } catch (error) {
        console.error("שגיאה בקבלת נתונים מהשרת:", error);
    }
}


function logout() {
    //  מחיקת אובייקט המשתמש מהזיכרון של הדפדפן
    localStorage.removeItem('user');
    
    // ניקוי דברים נוספים אם קיימים
    localStorage.clear(); 

    // שליחה חזרה לדף הבית (כי מזוהה עכשיו כאורח)
    window.location.href = 'index.html'
}

