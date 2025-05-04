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
  
      const title = form.elements["name"].value.trim();
      const location = form.elements["location"].value.trim();
      const description = form.elements["description"].value.trim();
      const difficulty = form.elements["difficulty"].value;
      const startingPoint = form.elements["start"].value.trim(); 
      const image = "https://via.placeholder.com/300x200"; 
  
      if (!title || !description || !difficulty || !startingPoint) {
        alert("PLEASE enter all.");
        return;
      }
  
      try {
        const response = await fetch("/submit-trail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            difficulty,
            startingPoint,
            location,
            image,
          }),
          
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("succes");
          window.location.href = "/index.html";
        } else {
          alert("error: " + result.message);
        }
      } catch (err) {
        console.error("error:", err);
        alert("no server.");
      }
    });
  });
  