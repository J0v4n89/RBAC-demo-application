const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    // USER who owns the workspace
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Members array with role + accessLevel
    members: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["owner", "member"],
                default: "member"
            },
            accessLevel: {
                type: String,
                enum: ["read", "comment", "edit", "full_access"],
                default: "read"
            }
        }
    ]
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
