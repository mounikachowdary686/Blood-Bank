import { IMAGES, LOW_STOCK } from '../data'

export default function Dashboard({ donors, inventory, requests, setPage }) {
  const totalUnits = Object.values(inventory).reduce((sum, u) => sum + u, 0)
  const pending = requests.filter((r) => r.status === 'Pending').length
  const lowStock = Object.values(inventory).filter((u) => u <= LOW_STOCK).length

  return (
    <div className="page-section">
      <img
        className="banner-img"
        src={IMAGES.hero}
        alt="Blood donation"
        onError={(e) => (e.target.style.display = 'none')}
      />
      <h2 className="section-title">Welcome</h2>

      <div className="hero-buttons">
        <button className="btn btn-primary hero-btn" onClick={() => setPage('donate')}>
          I want to donate blood
        </button>
        <button className="btn btn-danger hero-btn" onClick={() => setPage('requests')}>
          I need blood
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">{donors.length}</div>
          <div className="stat-label">Verified Donors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalUnits}</div>
          <div className="stat-label">Blood Units Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{lowStock}</div>
          <div className="stat-label">Low Stock Groups</div>
        </div>
      </div>

      <h2 className="section-title">How it works</h2>
      <div className="how-grid">
        <div className="card how-step"><b>1. Register</b><p>Donors fill the Donate form with address and ID details.</p></div>
        <div className="card how-step"><b>2. Verify</b><p>The blood bank checks and verifies the donor.</p></div>
        <div className="card how-step"><b>3. Request</b><p>Patients or hospitals submit a blood request.</p></div>
        <div className="card how-step"><b>4. Approve</b><p>The blood bank approves it and the stock updates.</p></div>
      </div>
    </div>
  )
}