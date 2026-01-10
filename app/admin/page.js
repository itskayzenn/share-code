'use client'
import { useState } from 'react'

export default function Admin() {
  const [key, setKey] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')

  const submit = async () => {
    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, title, language, code })
    })

    setMsg(res.ok ? '✅ Code shared' : '❌ Invalid key')
  }

  return (
    <main>
      <h1>🔐 Developer Access</h1>

      <input placeholder="Admin Key" onChange={e => setKey(e.target.value)} />
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Language" onChange={e => setLanguage(e.target.value)} />
      <textarea placeholder="Code..." onChange={e => setCode(e.target.value)} />

      <button onClick={submit}>Share Code</button>
      <p>{msg}</p>
    </main>
  )
      }
