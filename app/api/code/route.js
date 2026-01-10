import { codes } from '@/lib/store'

export async function GET() {
  return Response.json(codes)
}

export async function POST(req) {
  const { key, title, language, code } = await req.json()

  if (key !== process.env.ADMIN_KEY) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    )
  }

  codes.push({
    id: Date.now(),
    title,
    language,
    code
  })

  return Response.json({ success: true })
    }
