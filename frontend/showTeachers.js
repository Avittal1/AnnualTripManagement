async function loadTeachers() {
    try {
        const response = await fetch(`http://localhost:3000/api/students/teachers`);
        const teachers = await response.json();

        const tbody = document.querySelector('#teachersTable tbody');
        tbody.innerHTML = ""; // ניקוי הטבלה לפני מילוי

        if (teachers.length === 0) {
            const row = tbody.insertRow();
            // שורה של 4 עמודות
            row.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 20px; color: #666;">
                    לא נמצאו מורות במערכת.
                </td>
            `;
            return;
        }

        teachers.forEach(teacher => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${teacher.first_name}</td>
                <td>${teacher.last_name}</td>
                <td>${teacher.class}</td>
            `;
        });
    } catch (error) {
        console.error("שגיאה בקבלת נתונים מהשרת:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadTeachers);