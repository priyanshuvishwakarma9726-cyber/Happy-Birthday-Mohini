import type { Metadata } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { cn } from '@/lib/utils'
import { MusicProvider } from '@/context/MusicContext'
import MusicPlayer from '@/components/MusicPlayer'
import { ContentProvider } from '@/context/ContentContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing' })

export const metadata: Metadata = {
  title: 'Happy Birthday Mohini ❤️',
  description: 'A special surprise for a special person.',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_bypass')?.value === 'true'

  return (
    <html lang="en">
      <body className={cn(inter.variable, dancingScript.variable, "bg-black text-white antialiased", isAdmin ? "admin-mode" : "")}>
        <ContentProvider>
          <MusicProvider>
            {children}
            <MusicPlayer />
          </MusicProvider>
        </ContentProvider>
      </body>
    </html>
  )
}
