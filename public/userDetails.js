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

            document.getElementById("UserName").innerText = `Name: ${user.name}`;
            document.getElementById("UserId").innerText = `User ID: ${user.userId}`;
            document.getElementById("UserEmail").innerText = `Email Id: ${user.email}`;
            document.getElementById("UserPhone").innerText = `Phone No. : ${user.phone}`;

            // 🖼️ Set profile image
            const profileImg = document.getElementById("UserProfileImage");
            if (user.profileImage) {
                profileImg.src = `/uploads/${user.profileImage}`;
            } else {
                profileImg.src = "/uploads/default.png"; // fallback
            }

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
