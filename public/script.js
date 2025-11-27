let token = localStorage.getItem("token") || "";

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(r => r.json())
    .then(data => {
        if (data.token) {
            token = data.token;
            localStorage.setItem("token", token);
            if (!localStorage.getItem("role")) {
                localStorage.setItem("role", "member");
            }
            window.location.href = "workspace.html";
        } else {
            alert("Invalid credentials");
        }
    });
}

function protectPage() {
    if (!localStorage.getItem("token")) {
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

function createWorkspace() {
    const name = document.getElementById("wsName").value;

    fetch("http://localhost:3000/api/workspace/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ name })
    })
    .then(r => r.json())
    .then(data => {
        localStorage.setItem("role", "owner");
        alert(JSON.stringify(data, null, 2));
    });
}

function addMember() {
    const workspaceId = document.getElementById("workspaceId").value;
    const userId = document.getElementById("memberId").value;

    fetch(`http://localhost:3000/api/workspace/${workspaceId}/add-member`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ userId })
    })
    .then(r => r.json())
    .then(data => alert(JSON.stringify(data, null, 2)));
}

function changeAccess() {
    const wsId = document.getElementById("exploitWsId").value;
    const targetUser = document.getElementById("exploitUserId").value;
    const newAccess = document.getElementById("newAccess").value;

    fetch(`http://localhost:3000/api/workspace/${wsId}/change-access`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            targetUserId: targetUser,
            newAccessLevel: newAccess
        })
    })
    .then(r => r.json())
    .then(data => alert(JSON.stringify(data, null, 2)));
}

function lockButtonIfMember() {
    const role = localStorage.getItem("role");
    const btn = document.getElementById("changeBtn");

    if (role !== "owner") {
        btn.disabled = true;
        btn.style.background = "#ccc";
        btn.style.cursor = "not-allowed";
    }
}
