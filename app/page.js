'use client'
import { useEffect, useState } from 'react'
import CodeCard from '@/components/CodeCard'
import SocialLinks from '@/components/SocialLinks'

export default function Home() {
  const [codes, setCodes] = useState([])

  useEffect(() => {
    fetch('/api/code')
      .then(res => res.json())
      .then(setCodes)
  }, [])

  return (
    <main>
      <h1>💻 Share Code by {process.env.NEXT_PUBLIC_AUTHOR}</h1>
      {codes.map(code => (
        <CodeCard key={code.id} {...code} />
      ))}
      <SocialLinks />
    </main>
  )
        }
