import { useState } from 'react'
import { GROUPS } from '../data'

export default function Admin({ donors, requests, inventory, setDonorStatus, setUnits, setRequestStatus }) {
  const [error, setError] = useState('')

  async function handleReqStatus(id, newStatus) {
    const err = await setRequestStatus(id, newStatus)
    if (err) setError(err)
    else setError('')
  }

  return (
    <div className="page-section">
      <h2 className="section-title">Admin Dashboard</h2>
      <p className="info-note">Manage pending donor registrations, inventory stock levels, and patient blood requests.</p>

      {error && <div className="form-error mb-20">{error}</div>}

      {/* --- INVENTORY CONTROL --- */}
      <h3 className="section-title">Manage Inventory Stock</h3>
      <div className="inventory-grid mb-20">
        {GROUPS.map((g) => (
          <div className="inventory-card card" key={g}>
            <div className="inventory-group">{g}</div>
            <div className="inventory-units">{inventory[g] || 0} units</div>
            <div className="action-buttons mt-20">
              <button className="btn btn-danger" onClick={() => setUnits(g, (inventory[g] || 0) - 1)}>-</button>
              <button className="btn btn-success" onClick={() => setUnits(g, (inventory[g] || 0) + 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- DONORS APPROVAL --- */}
      <h3 className="section-title">Pending Donors ({donors.filter(d => d.status === 'Pending').length})</h3>
      <table className="data-table">
        <thead>
          <tr className="table-header">
            <th>Ref</th><th>Name</th><th>Blood</th><th>City</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((d) => (
            <tr className="table-row" key={d.id}>
              <td><code>{d.ref_code}</code></td>
              <td>{d.name}</td>
              <td><span className="blood-badge">{d.blood_group}</span></td>
              <td>{d.city}</td>
              <td><span className={'status-badge status-' + d.status.toLowerCase()}>{d.status}</span></td>
              <td>
                {d.status === 'Pending' && (
                  <div className="action-buttons">
                    <button className="btn btn-success" onClick={() => setDonorStatus(d.id, 'Verified')}>Verify</button>
                    <button className="btn btn-danger" onClick={() => setDonorStatus(d.id, 'Rejected')}>Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- REQUESTS APPROVAL --- */}
      <h3 className="section-title">Patient Requests ({requests.filter(r => r.status === 'Pending').length})</h3>
      <table className="data-table">
        <thead>
          <tr className="table-header">
            <th>Ref</th><th>Patient</th><th>Blood</th><th>Units</th><th>Hospital</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr className="table-row" key={r.id}>
              <td><code>{r.ref_code}</code></td>
              <td>{r.patient_name}</td>
              <td><span className="blood-badge">{r.blood_group}</span></td>
              <td>{r.units}</td>
              <td>{r.hospital}</td>
              <td><span className={'status-badge status-' + r.status.toLowerCase()}>{r.status}</span></td>
              <td>
                {r.status === 'Pending' && (
                  <div className="action-buttons">
                    <button className="btn btn-success" onClick={() => handleReqStatus(r.id, 'Approved')}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handleReqStatus(r.id, 'Rejected')}>Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}