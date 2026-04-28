async function performSearch() {
    const idInput = document.getElementById('searchInput');
    const message = document.getElementById('messageArea');
    const card = document.getElementById('resultCard');
    const studentC = document.getElementById('studentCard');

    const id = idInput.value.trim();

    // איפוס תצוגה לפני חיפוש חדש
    card.style.display = 'none';
    studentC.style.display = 'none';
    message.textContent = "";
    message.className = "message";

    if (id.length !== 9 || isNaN(id)) {
        message.textContent = "נא להזין תעודת זהות תקינה (9 ספרות)";
        message.classList.add("error-text");
        return;
    }

    message.textContent = "מחפש...";
    message.classList.add("loading-text");

    try {
        const response = await fetch(`http://localhost:3000/api/users/search/${id}`);
        const result = await response.json();

        if (response.status === 404) {
            message.textContent = result.error;
            message.className = "message error-text";
            return;
        }

        const user = result.data;
        message.textContent = "";

        document.getElementById('resType').textContent = `נמצאו נתונים עבור: ${result.type}`;
        document.getElementById('resFullName').textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById('resId').textContent = user.id;
        document.getElementById('resClass').textContent = user.class || 'לא צוין';

        if (result.type === 'תלמידה') {
            document.getElementById('resStatus').textContent = user.status;
            document.getElementById('resTeacher').textContent = result.teacherName;
            studentC.style.display = 'block';
        } else {
            studentC.style.display = 'none';
        }

        card.style.display = 'inline-block';

    } catch (error) {
        message.textContent = "שגיאה בחיבור לשרת";
        message.className = "message error-text";
    }
}