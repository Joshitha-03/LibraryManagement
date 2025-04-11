// 🟦 Sign Up
// document.querySelector('#signUpModal form').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const name = document.getElementById('signup-name').value;
//     const userId = document.getElementById('signup-user-id').value;
//     const email = document.getElementById('signup-email').value;
//     const phone = document.getElementById('signup-phone').value;
//     const password = document.getElementById('signup-password').value;
//     const confirmPassword = document.getElementById('signup-confirm-password').value;

//     if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     try {
//         const response = await fetch('/api/user/userSignIn', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, userId, email, phone, password })
//         });

//         const result = await response.json();
//         alert(result.message || "Sign up successful!");

//         if (response.ok) {
//             document.querySelector('#signUpModal form').reset();
//             bootstrap.Modal.getInstance(document.getElementById('signUpModal')).hide();
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Error during sign up.");
//     }
// });

document.querySelector('#signUpModal form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
  
    const password = formData.get("password");
    const confirmPassword = document.getElementById('signup-confirm-password').value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch('/api/user/userSignIn', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
      alert(result.message || "Sign up successful!");
  
      if (response.ok) {
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById('signUpModal')).hide();
      }
    } catch (err) {
      console.error(err);
      alert("Error during sign up.");
    }
  });
  

document.querySelector('#sign-in-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // This prevents the default form submission

    const userId = document.getElementById('signin-user-id').value;
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    console.log({ userId, email, password }); // Add this to confirm values

    try {
        const response = await fetch('/api/user/userLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            alert("Login successful!");
            window.location.href = "userdashboard.html";
            document.querySelector('#sign-in-form').reset();
            bootstrap.Modal.getInstance(document.getElementById('signInModal')).hide();
        } else {
            alert(result.message || "Invalid credentials");
        }
    } catch (err) {
        console.error(err);
        alert("Error during sign in.");
    }
});


