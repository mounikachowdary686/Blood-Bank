import { useState } from 'react'
import { GROUPS } from '../data'

function isEligible(lastDonation) {
  if (!lastDonation) return true
  const days = (new Date() - new Date(lastDonation)) / (1000 * 60 * 60 * 24)
  return days >= 90
}

export default function Donors({ donors }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const shown = donors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'All' || d.blood_group === filter)
  )

  return (
    <div className="page-section">
      <h2 className="section-title">Verified Donors</h2>
      <p className="info-note">Only donors verified by the blood bank are shown. Contact details are private.</p>

      <div className="search-bar">
        <input className="search-input" placeholder="Search by name..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {GROUPS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="empty-message">No verified donors yet</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr className="table-header">
              <th>Name</th><th>Blood</th><th>City</th><th>Available</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((d) => (
              <tr className="table-row" key={d.id}>
                <td>{d.name}</td>
                <td><span className="blood-badge">{d.blood_group}</span></td>
                <td>{d.city}</td>
                <td>
                  {isEligible(d.last_donation)
                    ? <span className="status-badge status-approved">Yes</span>
                    : <span className="status-badge status-rejected">No</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}