import './globals.css'

export const metadata = {
  title: 'PDF 聊天应用',
  description: '基于LLM和RAG的PDF聊天应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  )
}
