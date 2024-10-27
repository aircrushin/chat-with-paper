import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const { message, sourceId } = await req.json()
  
  if (!message || !sourceId) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.chatpdf.com/v1/chats/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CHATPDF_API_KEY!,
      },
      body: JSON.stringify({
        sourceId,
        messages: [
          {
            role: 'user',
            content: message,
          }
        ]
      }),
    })

    const { content } = await response.json()
    return NextResponse.json({ reply: content })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '聊天失败' }, { status: 500 })
  }
}