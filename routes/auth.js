const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
       
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();
        res.json({ msg: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
