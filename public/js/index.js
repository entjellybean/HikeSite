document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:8080/me");
    if (!response.ok) return;

    const data = await response.json();

    const loginBtn = document.querySelector(".login-btn");
    loginBtn.textContent = data.username;
    const logoutBtn = document.querySelector(".log-out");
if (logoutBtn) {
  logoutBtn.style.display = "inline-block";
  logoutBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/login.html";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  });
}

    loginBtn.onclick = null; 
    loginBtn.style.cursor = "default";
  } catch (error) {
    console.log("no user");
  }
});

async function loadTrails() {
  try {
    const sort = document.getElementById("sortFilter")?.value;
    const search = document.getElementById("searchInput")?.value.trim();

    let query = "/trails";
    const params = [];
    if (sort) params.push(`sort=${sort}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) query += "?" + params.join("&");

    const res = await fetch(query);
    if (!res.ok) return;

    const trails = await res.json();
    const container = document.querySelector(".trail-grid");
    container.innerHTML = "";

    for (const trail of trails) {
      const card = document.createElement("div");
      card.className = "trail-card";
      card.innerHTML = `
        <img src="${trail.image}" alt="${trail.title}">
        <div class="trail-content">
          <h3>${trail.title}             <span class="badge ${trail.difficulty.toLowerCase()}">${trail.difficulty}</span>

            <span>⭐ ${trail.avgRating}</span>
          </h3>
          <p class="location">${trail.location}</p>
            <p><strong>Distance:</strong> ${trail.distance} miles</p>

          <p><strong>Start:</strong> ${trail.startingPoint}</p>
          <p>${trail.description}</p>
          <a href="trail.html?id=${trail.id}">View Details →</a>
        </div>
      `;
      container.appendChild(card);
    }
  } catch (err) {
    console.error("data cannot be taken:", err);
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/me");
    if (response.ok) {
      const data = await response.json();
      const loginBtn = document.querySelector(".login-btn");
      loginBtn.textContent = data.username;
      loginBtn.onclick = null;
      loginBtn.style.cursor = "default";
    }
  } catch (error) {
    console.log("no user");
  }

  const sortDropdown = document.getElementById("sortFilter");
  if (sortDropdown) {
    sortDropdown.addEventListener("change", loadTrails);
  }

  const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input",loadTrails);
}
  await loadTrails();
});

