document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  if (!form) {
    console.error("form not found!");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const username = form.elements.username.value;
    const password = form.elements.password.value;
  
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        window.location.href = "/index.html";
      } else {
        alert(result.message); 
      }
    } catch (err) {
      console.error("error", err);
      alert("server error");
    }
  });
  
});
