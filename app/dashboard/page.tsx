import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getDashboardStats() {
  const supabase = await createClient()

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: activeClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return {
    totalClients: totalClients || 0,
    activeClients: activeClients || 0,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">LIFE Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Client Financial Progress Tracking</p>
            </div>
            <form action={async () => {
              'use server'
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect('/login')
            }}>
              <Button type="submit" variant="ghost">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-slate-600 mt-1">{stats.activeClients} currently active</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to LIFE Dashboard</CardTitle>
            <CardDescription>Your client financial progress tracking system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Get started by setting up your Supabase database and adding client data.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
