"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Document, Page, pdfjs } from 'react-pdf'

// 更新 worker CDN 路径
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/+esm'

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
  const [input, setInput] = useState('')
  const [sourceId, setSourceId] = useState<string>('')
  const searchParams = useSearchParams()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfUrl, setPdfUrl] = useState<string>('')

  useEffect(() => {
    const id = searchParams.get('sourceId')
    if (id) {
      setSourceId(id)
      // 获取PDF URL
      setPdfUrl(`/api/pdf/${id}`)
    }
  }, [searchParams])

  const sendMessage = async () => {
    if (!input.trim()) {
      alert('请输入消息内容');
      setInput(''); // 添加这行
      return;
    }
    
    if (!sourceId) {
      alert('请先上传或选择PDF文件');
      setInput(''); // 添加这行
      return;
    }
    
    const newMessage = { role: 'user', content: input }
    setMessages([...messages, newMessage])

    try {
      const response = await axios.post('/api/chat', { 
        message: input,
        sourceId 
      })
      const reply = response.data.reply
      setMessages([...messages, newMessage, { role: 'assistant', content: reply }])
      setInput('')
    } catch (error: any) {
      console.error('Chat error:', error)
      alert('聊天失败：' + (error.response?.data?.message || error.message))
    }
  }

  // 添加PDF控制函数
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset
      return Math.min(Math.max(1, newPageNumber), numPages)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter 换行，不做处理
        return;
      } else {
        // 普通 Enter 发送消息
        e.preventDefault();
        sendMessage();
      }
    }
  }

  return (
    <div className="flex h-screen">
      {/* PDF 预览区域 */}
      <div className="w-1/2 border-r bg-gray-50 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
            >
              <span>-</span>
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
            >
              <span>+</span>
            </button>
            <span>{pageNumber} / {numPages}</span>
          </div>
        </div>
        <div className="flex justify-center p-4">
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="max-w-full"
            >
              <Page 
                pageNumber={pageNumber}
                className="max-w-full"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="w-1/2 flex flex-col">
        <div className="border-b bg-white px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Chat</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <div className={`max-w-[90%] ${
                msg.role === 'user' ? 'ml-auto' : ''
              }`}>
                <div className={`rounded-lg p-3 text-sm ${  // 添加 text-sm 类
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={sendMessage}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
