document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    const issueForm = document.querySelector('#IssueBookForm');
    if (!issueForm) {
        console.error("IssueBookForm not found!");
        return;
    }

    issueForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = document.getElementById("issueUserId").value;
        const bookId = document.getElementById("issueBookId").value;

        console.log("Submitting issue form with:", { userId, bookId });

        try {
            const response = await fetch("http://localhost:5000/api/borrow/issueBook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, bookId })
            });

            const data = await response.json();
            console.log("Response from server:", data);
            alert("Issued Book successfully!");
        } catch (error) {
            console.error("Error issuing book:", error);
            alert("error issuing book!");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    const returnForm = document.querySelector('#ReturnBookForm');
    if (!returnForm) {
        console.error("ReturnBookForm not found!");
        return;
    }

    returnForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = document.getElementById("returnUserId").value;
        const bookId = document.getElementById("returnBookId").value;

        console.log("Submitting issue form with:", { userId, bookId });

        try {
            const response = await fetch("http://localhost:5000/api/borrow/returnBook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, bookId })
            });

            const data = await response.json();
            console.log("Response from server:", data);
            alert("Returned Book successfully!");
        } catch (error) {
            console.error("Error issuing book:", error);
            alert("error Returning book!");
        }
    });
});

