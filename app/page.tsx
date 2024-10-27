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
      {/* 顶部标题区域 */}
      <div className="max-w-4xl mx-auto pt-20 px-4">
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
    </div>
  )
}
