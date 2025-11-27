const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));
// test ruta
app.get("/", (req, res) => {
    res.send("RBAC Demo API running...");
});

// auth rute
app.use("/api/auth", require("./routes/auth"));
app.use("/api/workspace", require("./routes/workspace"));
// konekcija sa MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
