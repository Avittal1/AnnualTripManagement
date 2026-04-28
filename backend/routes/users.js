const express = require("express");
const router = express.Router();
const { supabase } = require("../supabase");

// בדיקה אם מורה קיימת לפי ת"ז
router.get("/check-teacher/:tid", async (req, res) => {
    const { tid } = req.params;

    const { data, error } = await supabase
        .from("Teachers")
        .select("id")
        .eq("id", tid)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.json({ exists: false });
    }

    return res.json({ exists: true });
});

// הרשמה
router.post("/register", async (req, res) => {
    const { id, first_name, last_name, class: className, role, teacher_id, status } = req.body;

    try {
        let table = (role === 'מורה') ? 'Teachers' : 'Students';

        let insertData = { id, first_name, last_name, class: className };

        if (role === 'תלמידה') {
            insertData.teacher_id = teacher_id;
            insertData.status = status || 'נוכחת';
        }

        const { data, error } = await supabase
            .from(table)
            .insert([insertData])
            .select() // הוספת ה-select() מחזירה את השורה שנשמרה
            .single();

        if (error) throw error;

        // הוספת ה-role לאובייקט המוחזר כדי שה-Frontend ידע מה התפקיד
        const userWithRole = { ...data, role: role };
        res.status(200).json({ message: "נרשם בהצלחה!", user: userWithRole });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {

    const { id, role } = req.body; //שליפת הנתונים

    try {
        // בחירת הטבלה הנכונה לפי התפקיד שהמשתמש בחר בטופס
        let table = (role === 'מורה') ? 'Teachers' : 'Students';

        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(401).json({ error: "משתמש לא נמצא במערכת" });
        }

        // אם המשתמש נמצא, נחזיר את כל הפרטים שלו + התפקיד
        // ה-Frontend ישמור את האובייקט הזה ב-localStorage
        res.status(200).json({ 
            user: { 
                ...data, 
                role: role // נוסיף את התפקיד ידנית כי לא נשמר בטבלה
            } 
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "שגיאה פנימית בשרת" });
    }
});


router.get("/search/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // חיפוש בטבלת מורות
        const { data: teacher, error: tError } = await supabase
            .from('Teachers')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (teacher) {
            return res.json({ type: 'מורה', data: teacher });
        }

        // חיפוש בטבלת תלמידות
        const { data: student, error: sError } = await supabase
            .from('Students')
            .select(`
                *,
                Teachers (
                    first_name,
                    last_name
                )
            `) // כאן הקסם קורה - סופבייס מחבר אוטומטית לפי ה-ID
            .eq('id', id)
            .maybeSingle();

        if (student) {
            // בניית שם המורה מהאובייקט שחזר
            const teacherFullName = student.Teachers 
                ? `${student.Teachers.first_name} ${student.Teachers.last_name}` 
                : 'לא שויכה מורה';

            return res.json({ 
                type: 'תלמידה', 
                data: student,
                teacherName: teacherFullName 
            });
        }

        res.status(404).json({ error: "לא נמצא משתמש עם תעודת זהות זו" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
