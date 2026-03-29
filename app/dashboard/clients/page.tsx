'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus } from 'lucide-react'
import Link from 'next/link'
import AddClientModal from '@/components/AddClientModal'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('last_name', { ascending: true })
    setClients(data || [])
  }

  useEffect(() => {
    fetchClients()
  }, [])

  // Helper to get display name
  const getFullName = (client: any) => {
    if (client.first_name || client.last_name) {
      return `${client.first_name || ''} ${client.last_name || ''}`.trim()
    }
    return client.name || 'Unnamed Client'
  }

  const getInitial = (client: any) => {
    return client.first_name?.charAt(0) || client.name?.charAt(0) || '?'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500 mt-1">Select a client to view their financial progress</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddClientModal
          onClose={() => {
            setShowModal(false)
            fetchClients()
          }}
        />
      )}

      {/* Client grid */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card className="hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                      {getInitial(client)}
                    </div>
                    <span className="text-slate-900">{getFullName(client)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm text-slate-500">
                    Status:{' '}
                    <span className={`font-medium ${client.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                      {client.status || 'N/A'}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500">Email: {client.email || 'N/A'}</p>
                  <p className="text-xs text-slate-400 mt-2">Click to view full profile →</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No clients yet</p>
            <p className="text-slate-400 text-sm mt-1">Click "Add New Client" to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
