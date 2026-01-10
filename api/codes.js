let codes = [
  {
    id: 1,
    title: "Welcome Code",
    language: "Text",
    code: "console.log("Hello World");",
    author: "Kayzen Izumi",
    role: "OWNER"
  }
]

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(codes)
  }

  if (req.method === "POST") {
    const { key, title, language, code, author, role } = req.body

    if (key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!["OWNER", "DEVELOPER"].includes(role)) {
      return res.status(403).json({ message: "Invalid role" })
    }

    const newCode = {
      id: Date.now(),
      title,
      language,
      code,
      author,
      role
    }

    codes.push(newCode)
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
