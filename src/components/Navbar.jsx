export default function Navbar({ page, setPage }) {
  const links = [
    { key: 'dashboard', label: 'Home' },
    { key: 'donate', label: 'Donate Blood' },
    { key: 'requests', label: 'Request Blood' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'donors', label: 'Donors' },
    { key: 'track', label: 'Track' },
    { key: 'admin', label: 'Admin (test)' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-logo">🩸 Blood Bank</div>
      <div className="navbar-links">
        {links.map((l) => (
          <button
            key={l.key}
            className={page === l.key ? 'nav-link nav-link-active' : 'nav-link'}
            onClick={() => setPage(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  )
}