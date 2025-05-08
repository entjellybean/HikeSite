document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/me");
      if (!response.ok) {
        window.location.href = "/login.html";
        return;
      }
    } catch (err) {
      console.error("connex error", err);
      window.location.href = "/login.html";
      return;
    }
  
    const form = document.querySelector("#trailForm");
    if (!form) {
      console.error("form not found");
      return;
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = document.querySelector("#trailForm");
const formData = new FormData(form);
      const fileInput = document.getElementById('image');

      const title = form.elements["title"].value.trim();
      const distance = parseFloat(form.elements["distance"].value.trim());

      const location = form.elements["location"].value.trim();
      const description = form.elements["description"].value.trim();
      const difficulty = form.elements["difficulty"].value;
      const startingPoint = form.elements["startingPoint"].value.trim(); 
      const image = "https://via.placeholder.com/300x200"; 
  
      if (!title || !description || !difficulty || !startingPoint) {
        alert("PLEASE enter all.");
        return;
      }
  
      try {
        const response = await fetch("/submit-trail", {
          method: "POST",
          credentials: "include",
          body:formData,
          
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("succes");
          window.location.href = `trail.html?id=${result.id}`;
        } else {
          alert("error: " + result.message);
        }
      } catch (err) {
        console.error("error:", err);
        alert("no server.");
      }
    });
  });

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("http://localhost:8080/me");
      if (!response.ok) return;
  
      const data = await response.json();
  
      const loginBtn = document.querySelector(".login-btn");
      loginBtn.textContent = data.username;
      loginBtn.onclick = null; 
      loginBtn.style.cursor = "default";
    } catch (error) {
      console.log("no user");
    }
  });
  