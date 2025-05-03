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
  