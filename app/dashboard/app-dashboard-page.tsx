import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  PiggyBank,
  CreditCard,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getDashboardStats() {
  const supabase = await createClient()

  // Get total clients
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  // Get active clients
  const { count: activeClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get average credit score change (simplified - you'd calculate from metrics)
  const { data: recentMetrics } = await supabase
    .from('financial_metrics')
    .select('credit_score')
    .not('credit_score', 'is', null)
    .order('metric_date', { ascending: false })
    .limit(100)

  const avgCreditScore = recentMetrics && recentMetrics.length > 0
    ? Math.round(recentMetrics.reduce((sum, m) => sum + (m.credit_score || 0), 0) / recentMetrics.length)
    : 0

  // Get loan statistics
  const { data: loans } = await supabase
    .from('loan_participation')
    .select('loan_amount')

  const totalLoansAmount = loans?.reduce((sum, loan) => sum + Number(loan.loan_amount), 0) || 0
  const totalLoansCount = loans?.length || 0

  // Get milestones count
  const { count: milestonesCount } = await supabase
    .from('milestones')
    .select('*', { count: 'exact', head: true })

  return {
    totalClients: totalClients || 0,
    activeClients: activeClients || 0,
    avgCreditScore,
    totalLoansAmount,
    totalLoansCount,
    milestonesCount: milestonesCount || 0,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      description: `${stats.activeClients} currently active`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Avg Credit Score',
      value: stats.avgCreditScore,
      description: 'Recent client average',
      icon: CreditCard,
      color: 'text-green-600',
    },
    {
      title: 'Total Loans Disbursed',
      value: `$${stats.totalLoansAmount.toLocaleString()}`,
      description: `${stats.totalLoansCount} loans active`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Milestones Achieved',
      value: stats.milestonesCount,
      description: 'Client success markers',
      icon: Target,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">LIFE Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Client Financial Progress Tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/reports">Reports</Link>
              </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <Link href="/dashboard/clients">
                  <Users className="h-6 w-6" />
                  <span>View All Clients</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <Link href="/dashboard/clients/new">
                  <TrendingUp className="h-6 w-6" />
                  <span>Add New Client</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <Link href="/dashboard/reports">
                  <PiggyBank className="h-6 w-6" />
                  <span>Generate Report</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Recent client milestones and updates will appear here.
              Connect your database and add client data to get started.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
