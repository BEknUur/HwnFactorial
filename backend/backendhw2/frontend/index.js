document.getElementById("send").addEventListener("click", async () => {
  const provider = document.getElementById("provider").value;
  const prompt   = document.getElementById("prompt").value.trim();
  const respElem = document.getElementById("response");
  if (!prompt) {
    respElem.textContent = "Please enter a prompt.";
    return;
  }

  respElem.textContent = "…sending…";

  try {
    const res = await fetch("/api/v1/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, prompt }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(res.status + " " + text);
    }
    const data = await res.json();
    respElem.textContent = data.response;
  } catch (err) {
    respElem.textContent = "Error: " + err;
  }
});
