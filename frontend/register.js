// Create an Object for each Field
const form = document.getElementById("registerForm");
const fnameInput = document.getElementById("fname");
const lnameInput = document.getElementById("lname");
const classInput = document.getElementById("class");
const idInput = document.getElementById("id");
//const roleInput = document.getElementById("role");
const roleInputs = document.querySelectorAll('input[name="role"]');
const tidInput = document.getElementById("tid");
const statusInput = document.getElementById("status");
const studentExtraFields = document.getElementById("studentExtraFields");

const fnameError = document.getElementById("fnameError");
const lnameError = document.getElementById("lnameError");
const classError = document.getElementById("classError");
const idError = document.getElementById("idError");
const roleError = document.getElementById("roleError");
const tidError = document.getElementById("tidError");
const statusError = document.getElementById("statusError");

const result = document.getElementById("result");

// פונקציה להצגת שגיאות
function showError(el, message) {
  el.innerHTML = message;
}

// פונקציה לניקוי שדה שגיאה
function clearError(el) {
  el.innerHTML = "";
}

// קבלת התפקיד שנבחר
function getSelectedRole() {
  for (const r of roleInputs) {
    if (r.checked) return r.value;
  }
  return null;
}

// הצגת/הסתרת שדות תלמידה
roleInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const role = getSelectedRole();
    if (role === "תלמידה") {
      studentExtraFields.style.display = "block";
    } else {
      studentExtraFields.style.display = "none";
      tidInput.value = "";
      statusInput.value = "";
      clearError(tidError);
      clearError(statusError);
    }
  });
});

form.addEventListener("submit", async function (event) {

  event.preventDefault();// מניעת טעינה מחדש של ברירת מחדל

  if (result) {
    result.textContent = "";
    result.className = "";
  }

  const isValid = await validateForm();

  if (isValid) {
    if (result) {
      result.textContent = "הנתונים תקינים, מתחבר...";
      result.className = "ok";
    }
   // כאן תבוא שליחת POST לשרת
   const role = getSelectedRole();

const body = {
  id: idInput.value.trim(),
  first_name: fnameInput.value.trim(),
  last_name: lnameInput.value.trim(),
  class: classInput.value.trim(),
  role: role,
  teacher_id: role === "תלמידה" ? tidInput.value.trim() : null,
  status: role === "תלמידה" ? statusInput.value.trim() : null
};

const res = await fetch(`http://localhost:3000/api/users/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

const data = await res.json();

if (!res.ok) {
  result.textContent = data.error || "שגיאה בשמירת הנתונים";
  result.className = "error";
  return;
}
// שמירת פרטי המשתמש בזיכרון של הדפדפן
localStorage.setItem("user", JSON.stringify(data.user)); 

window.location.href = "index.html";

  } else {
    if (result) {
      result.textContent = "יש לתקן את השגיאות בטופס";
      result.className = "error";
    }
  }
});

// בדיקת תקינותהשם הפרטי
function validateFname() {
  let value = fnameInput.value.trim();
  if (value.length < 2) {
    showError(fnameError, "שם צריך להיות 2 אותיות לפחות");
    return false;
  }
  clearError(fnameError);
  return true;
}

// בדיקת תקינות השם משפחה
function validateLname() {
  let value = lnameInput.value.trim();
  if (value.length < 2) {
    showError(lnameError, "משפחה צריכה להיות 2 אותיות לפחות");
    return false;
  }
  clearError(lnameError);
  return true;
}

// בדיקת תקינות כיתה
function validateClass(){
  let value = classInput.value.trim();
  
  const validGrades = /^(כיתה\s+)?([א-ט]|י[אב]?|י)$/; // רשימת האותיות המותרות (א-יב)
  if(!validGrades.test(value)){
    showError(classError, "כיתה יכולה להיות מהכיתות א-יב");
    return false;
  }
  clearError(classError);
  return true;
}

// בדיקת תקינות ת.ז
function validateId() {

    let value = idInput.value.trim();

    if (value.length === 0) {
        showError(idError, "שדה תעודת זהות חובה.");
        return false;
    }
    if (value.length !== 9 || isNaN(value)) {
        showError(idError, "תעודת זהות חייבת להכיל בדיוק 9 ספרות.");
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let num = Number(value.charAt(i)) * ((i % 2) + 1);// לכל ספרה במיקום אי זוגי נכפיל ב1 ובזוגי נכפיל ב2
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

// בדיקת תקינות תפקיד
function validateRole(){
    const role = getSelectedRole();
  if (!role) {
    showError(roleError, "יש לבחור תפקיד");
    return false;
  }
  clearError(roleError);
  return true;
}

// בדיקת תקינות סטטוס (לתלמידה בלבד)
function validateStatus(role) {
  if (role !== "תלמידה") return true;
  const v = statusInput.value.trim();
  if (!v) {
    showError(statusError, "יש לבחור סטטוס");
    return false;
  }
  clearError(statusError);
  return true;
}

// מורה תקינה (קיימת)
async function validateTid(role) {
   if (role !== "תלמידה") return true;

  const tid = tidInput.value.trim();
  if (tid.length !== 9 || isNaN(tid)) {
    showError(tidError, "תעודת זהות של מורה חייבת להיות 9 ספרות");
    return false;
  }

  const res = await fetch(`http://localhost:3000/api/users/check-teacher/${tid}`);
  const data = await res.json();

  if (!data.exists) {
    showError(tidError, "המורה לא קיימת במערכת");
    return false;
  }

  clearError(tidError);
  return true;
}


// אימות טופס
async function validateForm() {
  const okFname = validateFname();
  const okLname = validateLname();
  const okClass = validateClass();
  const okId = validateId();
  const okRole = validateRole();

  const role = getSelectedRole();

  const okStatus = validateStatus(role);
  const okTid = await validateTid(role);

  return okFname && okLname && okClass && okId && okRole && okStatus && okTid;
}
