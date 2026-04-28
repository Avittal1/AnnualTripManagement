async function loadStudents() {
    try {
        const response = await fetch(`http://localhost:3000/api/students/students`);
        const students = await response.json();

        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = ""; // ניקוי הטבלה לפני מילוי

        if (students.length === 0) {
            const row = tbody.insertRow();
            // שורה של 6 עמודות
            row.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 20px; color: #666;">
                    לא נמצאו תלמידות במערכת.
                </td>
            `;
            return; 
        }

        students.forEach(student => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.first_name}</td>
                <td>${student.last_name}</td>
                <td>${student.class}</td>
                <td>${student.teacher_id}</td>
                <td>${student.status}</td>
            `;
        });
    } catch (error) {
        console.error("שגיאה בקבלת נתונים מהשרת:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadStudents);