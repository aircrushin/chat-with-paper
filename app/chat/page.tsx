"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
  const [input, setInput] = useState('')
  const [sourceId, setSourceId] = useState<string>('')
  const searchParams = useSearchParams()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const id = searchParams.get('sourceId')
    if (id) {
      setSourceId(id)
    }
  }, [searchParams])

  const sendMessage = async () => {
    if (!input.trim()) {
      alert('请输入消息内容');
      setInput('');
      return;
    }
    
    if (!sourceId) {
      alert('请先上传或选择PDF文件');
      setInput('');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        sendMessage();
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#F7F8FA]">
      <header className="h-14 border-b bg-white flex items-center px-4 fixed w-full top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl tracking-wider font-semibold">PDFChat</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] mt-14">
        <div className={`${isSidebarCollapsed ? 'w-0' : 'w-64'} bg-white border-r transition-all duration-300 flex flex-col relative`}>
          <button 
            className="absolute -right-3 top-4 bg-white border rounded-full p-1 shadow-sm z-10"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            <svg 
              className={`w-4 h-4 transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="p-4">
            <button 
              className="w-full flex items-center gap-2 px-4 py-2 bg-[#F7F8FA] rounded-full text-sm hover:bg-gray-100"
              onClick={() => {/* 处理新对话逻辑 */}}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              开启新对话
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-xs text-gray-500 px-2 py-1">暂无历史对话</div>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              个人信息
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
            {messages.map((msg, index) => (
              <div key={index} className="mb-6">
                <div className={`max-w-[90%] ${
                  msg.role === 'user' ? 'ml-auto' : ''
                }`}>
                  <div className={`rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-[#2A63F3] text-white'
                      : 'bg-white shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3 items-center bg-white rounded-full border px-4 py-2">
                <input
                  className="flex-1 outline-none text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="给 PDFChat AI 发送消息"
                />
                <button
                  className="px-4 py-2 bg-[#2A63F3] text-white rounded-full text-sm"
                  onClick={sendMessage}
                >
                  发送
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                内容由 AI 生成，请仔细甄别
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
