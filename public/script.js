document.querySelector("#adminLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();  
    
    // Get values from the input fields
    const username = document.querySelector("#admin-username").value;
    const password = document.querySelector("#admin-password").value;

    // Validate if both fields are filled
    if (!username || !password) {
        alert("Please fill in both username and password!");
        return;
    }
    
    try {
        // Make a POST request to the backend to authenticate the admin
        const res = await fetch("http://localhost:5000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        // Handle successful or failed login
        if (res.ok) {
            alert("Login successful!");
            window.location.href = "/admindashboard.html";  
            // Redirect to dashboard or other pages as needed
        } else {
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred. Please try again.");
    }
});
