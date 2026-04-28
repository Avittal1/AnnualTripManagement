const express = require("express");
const router = express.Router();
const { supabase } = require("../supabase"); // ייבוא הלקוח מהקובץ שיצרת

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
