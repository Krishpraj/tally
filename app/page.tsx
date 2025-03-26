import TaxAssistant from '@/components/tax-assistant'
import { Toaster } from '@/components/ui/toaster'

// Enable Partial Prerendering for this page
export const experimental_ppr = true

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Your Personal Tax Expert
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-3">
              Tax Assistant
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant answers to your tax questions and personalized guidance for your tax return
            </p>
          </div>
          
          <TaxAssistant />
        </div>
      </div>
      <Toaster />
    </main>
  )
}

