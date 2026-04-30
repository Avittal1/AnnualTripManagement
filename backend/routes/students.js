const express = require("express");
const router = express.Router();
const { supabase } = require("../supabase"); // ייבוא הלקוח מהקובץ שיצרת

// משתנה מקומי בשרת שיחזיק את המיקומים האחרונים בלבד
// המפתח יהיה ID של התלמידה, והערך יהיה אובייקט הנתונים שלה
let latestLocations = {};// הגדרת משתנה גלובלי בזיכרון השרת

//ראוטר עדכון מיקום
router.post("/update-location", (req, res) => {
    const { ID, Coordinates, Time } = req.body;

    if (!ID || !Coordinates) {
        return res.status(400).json({ error: "Missing data" });
    }

    // עדכון בזיכרון - דורס רק את המיקום הקודם של אותה תלמידה
    latestLocations[ID] = {
        id : ID,
        coordinates: Coordinates,
        time: Time
    };

    res.status(200).json({ message: "Location updated in memory" });
});

// ראוטר שמקבל את כל המיקומים
router.get("/all-locations", (req, res) => {
    // הופכים את האובייקט למערך כדי שהמפה תוכל לעבור עליו ב-forEach
    res.json(Object.values(latestLocations));
});

// הראוטר שמחזיר תלמידות לפי מורה
router.get("/teacher/:teacherId", async (req, res) => {
    const { teacherId } = req.params;
    try {
        const { data, error } = await supabase
            .from('Students')
            .select('*')
            .eq('teacher_id', teacherId);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// הראוטר שמחזיר את המורות
router.get("/teachers", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Teachers')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// הראוטר שמחזיר את התלמידות
router.get("/students", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Students')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
