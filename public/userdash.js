document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to view this page.");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch("/api/user/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById("welcomeUser").innerText = `Welcome, ${user.name}`;
        } else {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        }
    } catch (err) {
        console.error("Error loading user data:", err);
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
});

