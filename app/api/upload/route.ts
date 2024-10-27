import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const file = formData.get('pdf') as File
  
  if (!file) {
    return NextResponse.json({ error: '未上传文件' }, { status: 400 })
  }

  try {
    // 调用 ChatPDF 上传 API
    const uploadResponse = await fetch('https://api.chatpdf.com/v1/sources/add-file', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CHATPDF_API_KEY!,
      },
      body: formData,
    })

    const { sourceId } = await uploadResponse.json()

    return NextResponse.json({ 
      sourceId,
      message: 'PDF上传成功' 
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'PDF上传失败' }, { status: 500 })
  }
}