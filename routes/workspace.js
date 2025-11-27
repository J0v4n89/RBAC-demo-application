const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Workspace = require("../models/Workspace");


router.post("/create", auth, async (req, res) => {
    const { name } = req.body;

    try {
        const workspace = new Workspace({
            name,
            owner: req.user.userId,
            members: [{
                userId: req.user.userId,
                role: "owner",
                accessLevel: "full_access"
            }]
        });

        await workspace.save();

        res.json({
            msg: "Workspace created",
            workspace
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


router.post("/:id/add-member", auth, async (req, res) => {
    const workspaceId = req.params.id;
    const { userId } = req.body;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

        const already = workspace.members.find(m => m.userId.toString() === userId);
        if (already) return res.status(400).json({ msg: "User already a member" });

        workspace.members.push({
            userId,
            role: "member",
            accessLevel: "read"
        });

        await workspace.save();

        res.json({
            msg: "Member added",
            workspace
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});



router.post("/:id/change-access", auth, async (req, res) => {
    const workspaceId = req.params.id;
    const { targetUserId, newAccessLevel } = req.body;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

        const member = workspace.members.find(
            m => m.userId.toString() === targetUserId
        );
        if (!member) return res.status(400).json({ msg: "User not in workspace" });

        
        member.accessLevel = newAccessLevel;

        await workspace.save();

        res.json({
            msg: "Access level changed (VULNERABLE ENDPOINT)",
            workspace
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});



module.exports = router;
