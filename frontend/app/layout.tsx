import './styles/globals.css'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export const metadata = {
  title: 'Restaurant Manager',
  description: 'Смачна їжа з доставкою додому',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}