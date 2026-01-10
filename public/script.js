const API_URL = "/api/codes"

const codeList = document.getElementById("codeList")

if (codeList) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      data.forEach(renderCode)
    })
}

function renderCode(c) {
  const div = document.createElement("div")
  div.className = "card"

  const badge = c.role === "OWNER"
    ? `<span class="owner">👑 OWNER</span>`
    : `<span class="dev">🛠 DEVELOPER</span>`

  div.innerHTML = `
    <h3>${c.title}</h3>
    <small>${c.language}</small>
    <p>by <b>${c.author}</b></p>
    ${badge}
    <pre>${c.code}</pre>
    <button onclick="copyCode(\`${c.code}\`)">Copy</button>
  `
  codeList.appendChild(div)
}

function copyCode(text) {
  navigator.clipboard.writeText(text)
  alert("Code copied!")
}

function shareCode() {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: key.value,
      title: title.value,
      language: language.value,
      code: code.value,
      author: author.value,
      role: role.value
    })
  })
  .then(res => res.json())
  .then(r => {
    msg.innerText = r.success ? "✅ Shared!" : "❌ Failed"
  })
      }
