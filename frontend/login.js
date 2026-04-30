// Create an Object for each Field
const form = document.getElementById("signupForm");
const idInput = document.getElementById("id");
const roleInput = document.getElementById("role");
const idError = document.getElementById("idError");
const roleError = document.getElementById("roleError");
const result = document.getElementById("result");

// פונקציה להצגת שגיאות
function showError(el, message) {
  el.innerHTML = message;
}

// פונקציה לניקוי שדה שגיאה
function clearError(el) {
  el.innerHTML = "";
}


form.addEventListener("submit", async function (event) {

  event.preventDefault();// מניעת טעינה מחדש של ברירת מחדל

  result.innerHTML = "";// ניקוי תשובה

  // אימות טופס
  if (validateForm()) {

    result.innerHTML = "הנתונים תקינים, מתחבר...";
    result.className = "ok";

    const id = idInput.value.trim();
    const role = roleInput.value.trim();

    try {
      // שליחת בקשה לשרת לבדיקה אם המשתמש קיים
      const res = await fetch(`http://localhost:3000/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role })
      });

      const data = await res.json();

      if (!res.ok) {
        showError(idError, data.error || "משתמש לא נמצא או פרטים שגויים");
        result.innerHTML = "";
        
      } else {
        // שמירת נתוני המשתמש
        localStorage.setItem('user', JSON.stringify(data.user));
        
        result.innerHTML = "התחברת בהצלחה! מעביר לדף הבית...";
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
      }
      } catch (err) {
    result.innerHTML = "שגיאה בחיבור לשרת";
      result.className = "error";
    }
  }
});

// בדיקת תקינות ת.ז
function validateId() {
    id=idInput.value;
    id = String(id).trim();

    if (id.length === 0) {
        showError(idError, "שדה תעודת זהות חובה.");
        return false;
    }
    if (id.length !== 9 || isNaN(id)) {
        showError(idError, "תעודת זהות חייבת להכיל בדיוק 9 ספרות.");
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let num = Number(id.charAt(i)) * ((i % 2) + 1);// לכל ספרה במיקום אי זוגי נכפיל ב1 ובזוגי נכפיל ב2
        if (num > 9) num -= 9;//נסכום כל מספר לספרה אחת
        sum += num;// סכימת כל הספרות
    }

    if (sum % 10 !== 0) {// אין שארית
        showError(idError, "מספר תעודת הזהות אינו תקין (ספרת ביקורת שגויה).");
        return false;
    }

  clearError(idError);
  return true;
}

function validateRole(){
    let role=roleInput.value;
    if (!role) {
    showError(roleError, "יש לבחור תפקיד.");
    return false;
  }
  clearError(roleError);
  return true;
}

// אימות טופס
function validateForm() {
  let okId = validateId();
  let okRole = validateRole();
  return okId && okRole;
}
