import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Luton AI",
    description: "Luton AI Community Platform",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                    <div className="relative min-h-screen flex flex-col">
                        <SiteHeader />
                        <main className="flex-1">
                            {children}
                        </main>
                        <SiteFooter />
                    </div>
                    <Toaster />
            </body>
        </html>
    )
} 