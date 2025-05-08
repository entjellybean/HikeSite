let currentTrail = null;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const trailId = params.get("id");

  if (!trailId) {
    document.getElementById("trail-detail").innerHTML = "<p>Trail not found.</p>";
    return;
  }

  try {
    const response = await fetch(`/trail/${trailId}`);
    if (!response.ok) throw new Error("Not found");

    currentTrail = await response.json();

    const detailHtml = `
      <section class="trail-card detail-view">
        <img class="trail-image" src="${currentTrail.image}" alt="${currentTrail.title}">
        <div class="trail-content">
          <h2>${currentTrail.title}   <span class="badge ${currentTrail.difficulty.toLowerCase()}">${currentTrail.difficulty}</span>
</h2>
          <p><strong>Location:</strong> ${currentTrail.location}</p>
          <p class="trail-start"><strong>Starting Point:</strong> ${currentTrail.startingPoint}</p>
          <p class="trail-distance"><strong>Distance:</strong> ${currentTrail.distance} miles</p>
          <p class="trail-description">${currentTrail.description}</p>
          <p><strong>Rating:</strong> ⭐ ${currentTrail.avgRating}</p>
          <p><em>Contributed by: ${currentTrail.user}</em></p>
        </div>
      </section>
    `;

    document.getElementById("trail-detail").innerHTML = detailHtml;

    const formContainer = document.createElement("div");
    formContainer.style.marginTop = "20px";
    formContainer.style.textAlign = "center";


    if (currentTrail.userRating !== null && currentTrail.userRating !== undefined) {
      formContainer.innerHTML = `<p><strong>Your rating:</strong> ⭐ ${currentTrail.userRating}</p>`;
    } else {
      formContainer.innerHTML = `
        <form id="rating-form">
          <label for="rating">Rate this trail (1–5):</label>
          <select name="rating" id="rating" required>
            <option value="">--</option>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>
          <button type="submit">Submit Rating</button>
        </form>
        <div id="rating-msg" style="margin-top:10px; font-size:0.9em;"></div>
      `;
    }

    document.getElementById("trail-detail").appendChild(formContainer);

  } catch (err) {
    document.getElementById("trail-detail").innerHTML = "<p>Trail could not be loaded.</p>";
  }
  const form = document.getElementById("rating-form");
  const msgBox = document.getElementById("rating-msg");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const rating = parseInt(document.getElementById("rating").value);

      if (!rating || rating < 1 || rating > 5) {
        msgBox.textContent = "PLEASE enter a valid rating (1-5)";
        return;
      }

      try {
        const response = await fetch("/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ trailId: currentTrail.id, rating })
        });

        const result = await response.json();

        if (response.ok) {
          msgBox.textContent = "your score is recorded.";
                    const formContainer = document.getElementById("rating-form").parentElement;
          formContainer.innerHTML = `<p><strong>Your rating:</strong> ⭐ ${rating}</p>`;
        
        } else {
          msgBox.textContent = "error: " + result.message;
        }
      } catch (err) {
        msgBox.textContent = "Server error.";
      }
    });
  }
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
