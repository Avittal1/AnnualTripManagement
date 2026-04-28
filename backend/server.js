const express = require("express");
const cors = require("cors");
const http = require("http");
const { supabase } = require("./supabase");
const path = require("path");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//קבצי frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));


// Routes
const studentsRouter = require("./routes/students");
const usersRouter = require("./routes/users");

app.use("/api/students", studentsRouter);
app.use("/api/users", usersRouter);

// the server
const server = http.createServer(app);

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Backend API running at http://localhost:${PORT}`);
});
