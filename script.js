const ADMIN_KEY = "KAYZEN_DEV_2026"

// Load code
const codeList = document.getElementById("codeList")
let codes = JSON.parse(localStorage.getItem("codes")) || []

if (codeList) {
  codes.forEach(c => renderCode(c))
}

function renderCode(c) {
  const div = document.createElement("div")
  div.className = "card"
  div.innerHTML = `
    <h3>${c.title}</h3>
    <small>${c.lang}</small>
    <pre>${c.code}</pre>
    <button onclick="copyCode(\`${c.code}\`)">Copy</button>
  `
  codeList.appendChild(div)
}

function copyCode(text) {
  navigator.clipboard.writeText(text)
  alert("✅ Code copied!")
}

// Admin share
function shareCode() {
  const key = document.getElementById("key").value
  if (key !== ADMIN_KEY) {
    document.getElementById("msg").innerText = "❌ Invalid Key"
    return
  }

  const data = {
    title: title.value,
    lang: lang.value,
    code: code.value
  }

  codes.push(data)
  localStorage.setItem("codes", JSON.stringify(codes))
  document.getElementById("msg").innerText = "✅ Code shared!"
}
