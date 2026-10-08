import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Donate from './components/Donate'
import Donors from './components/Donors'
import Inventory from './components/Inventory'
import Requests from './components/Requests'
import Track from './components/Track'
import Admin from './components/Admin'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [donors, setDonors] = useState([])
  const [inventory, setInventory] = useState({})
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchData()

    // Real-time updates listener for instant updates on all open clients
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchData() {
    // 1. Fetch Donors
    const { data: donorData } = await supabase.from('donors').select('*').order('created_at', { ascending: false })
    if (donorData) setDonors(donorData)

    // 2. Fetch Inventory
    const { data: invData } = await supabase.from('inventory').select('*')
    if (invData) {
      const invObj = {}
      invData.forEach((row) => (invObj[row.blood_group] = row.units))
      setInventory(invObj)
    }

    // 3. Fetch Requests
    const { data: reqData } = await supabase.from('requests').select('*').order('created_at', { ascending: false })
    if (reqData) setRequests(reqData)
  }

  // ---------- VISITOR ACTIONS ----------
  async function addDonor(donor) {
    const { error } = await supabase.from('donors').insert([donor])
    return error
  }

  async function addRequest(req) {
    const { error } = await supabase.from('requests').insert([req])
    return error
  }

  // ---------- ADMIN ACTIONS ----------
  async function setDonorStatus(id, status) {
    await supabase.from('donors').update({ status }).eq('id', id)
  }

  async function setUnits(group, units) {
    if (units < 0) return
    await supabase.from('inventory').update({ units }).eq('blood_group', group)
  }

  async function setRequestStatus(id, status) {
    const req = requests.find((r) => r.id === id)
    if (status === 'Approved') {
      const available = inventory[req.blood_group] || 0
      if (available < req.units) {
        return 'Not enough ' + req.blood_group + ' blood in stock (available: ' + available + ')'
      }
      // Deduct blood units from inventory table
      await supabase.from('inventory').update({ units: available - req.units }).eq('blood_group', req.blood_group)
    }
    await supabase.from('requests').update({ status }).eq('id', id)
    return null
  }

  // Public views only display verified donors
  const verifiedDonors = donors.filter((d) => d.status === 'Verified')

  return (
    <div className="app-container">
      <Navbar page={page} setPage={setPage} />

      {page === 'dashboard' && (
        <Dashboard donors={verifiedDonors} inventory={inventory} requests={requests} setPage={setPage} />
      )}
      {page === 'donate' && <Donate addDonor={addDonor} />}
      {page === 'donors' && <Donors donors={verifiedDonors} />}
      {page === 'inventory' && <Inventory inventory={inventory} />}
      {page === 'requests' && <Requests requests={requests} addRequest={addRequest} />}
      {page === 'track' && <Track donors={donors} requests={requests} />}
      {page === 'admin' && (
        <Admin
          donors={donors}
          requests={requests}
          inventory={inventory}
          setDonorStatus={setDonorStatus}
          setUnits={setUnits}
          setRequestStatus={setRequestStatus}
        />
      )}
    </div>
  )
}