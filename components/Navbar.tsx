'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-purple-600 p-4">
      <div className="flex space-x-4">
        <Link href="/" className="text-white">上传PDF</Link>
        <Link href="/chat" className="text-white">聊天</Link>
      </div>
    </nav>
  )
}
