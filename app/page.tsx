"use client"

import { useState, useCallback } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      setFile(acceptedFiles[0])
      handleUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleUpload = async (uploadFile: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('pdf', uploadFile)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      localStorage.setItem('pdfSourceId', response.data.sourceId)
      router.push(`/chat?sourceId=${response.data.sourceId}`)
    } catch (error) {
      console.error(error)
      alert('上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xl font-bold">PDF Chat</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600">功能</a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600">价格</a>
            <a href="#faq" className="text-gray-600 hover:text-purple-600">常见问题</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-purple-600 hover:text-purple-700">登录</button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">注册</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto pt-32 px-4">
        <h1 className="text-5xl font-bold text-center mb-4">
          Chat with any <span className="bg-purple-600 text-white px-2 rounded">PDF</span>
        </h1>
        <p className="text-center text-xl text-gray-600 mb-12">
          加入数百万
          <span className="text-orange-500 hover:underline cursor-pointer">
            学生、研究人员和专业人士
          </span>
          的行列，使用 AI 即时回答问题并理解研究内容。
        </p>

        {/* 上传区域 */}
        <div {...getRootProps()} className="w-full">
          <div className={`
            border-2 border-dashed border-purple-300 rounded-2xl
            bg-white p-12 transition-all
            ${isDragActive ? 'border-purple-500 bg-purple-50' : ''}
            hover:border-purple-500 hover:bg-purple-50
            cursor-pointer
          `}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                ) : (
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              </div>
              <p className="text-xl mb-2">
                {isUploading ? '正在上传...' : '点击上传或拖拽 PDF 文件到这里'}
              </p>
              <button 
                className={`
                  bg-purple-600 text-white px-6 py-3 rounded-xl 
                  transition-colors mt-4
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}
                `}
                disabled={isUploading}
              >
                {isUploading ? '上传中...' : '上传 PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">强大的 PDF 智能助手</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "智能对话",
                description: "与文档进行自然对话，获取精确答案",
                icon: "💬"
              },
              {
                title: "多语言支持",
                description: "支持中英文等多种语言的文档处理",
                icon: "🌍"
              },
              {
                title: "快速摘要",
                description: "自动生成文档重点内容摘要",
                icon: "📝"
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>
          <div className="space-y-6">
            {[
              {
                q: "支持哪些类型的 PDF 文件？",
                a: "我们支持所有标准的 PDF 文件，包括扫描文档、文本 PDF 等。"
              },
              {
                q: "如何保证数据安全？",
                a: "所有上传的文件都经过加密存储，且仅供您个人访问使用。"
              },
              {
                q: "免费版有什么限制？",
                a: "免费版每月可以处理 3 个 PDF 文件，单个文件大小限制为 10MB。"
              }
            ].map((item) => (
              <div key={item.q} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">PDF Chat</h3>
              <p className="text-sm">智能 PDF 阅读助手，让文档交互更简单。</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">功能</a></li>
                <li><a href="#" className="hover:text-white">价格</a></li>
                <li><a href="#" className="hover:text-white">企业版</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">帮助中心</a></li>
                <li><a href="#" className="hover:text-white">API 文档</a></li>
                <li><a href="#" className="hover:text-white">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">关注我们</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" className="hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
            <p>&copy; 2024 PDF Chat. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
