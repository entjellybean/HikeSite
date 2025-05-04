document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const errorDiv = document.querySelector("#error-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorDiv.textContent = ""; // önceki hatayı temizle

    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const isNewUser = form.elements["new-user"].checked;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, isNewUser }),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = "/index.html";
      } else {
        errorDiv.textContent = result.message;
      }
    } catch (err) {
      console.error("İstek hatası:", err);
      errorDiv.textContent = "Sunucuya bağlanılamadı!";
    }
  });
});
