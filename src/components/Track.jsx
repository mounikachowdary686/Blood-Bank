import { useState } from 'react'

export default function Track({ donors, requests }) {
  const [refCode, setRefCode] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  function handleSearch(e) {
    e.preventDefault()
    const query = refCode.trim().toUpperCase()
    if (!query) return

    // Look for match in donors or requests
    const donorMatch = donors.find((d) => d.ref_code === query)
    const requestMatch = requests.find((r) => r.ref_code === query)

    if (donorMatch) {
      setResult({ type: 'Donor Registration', name: donorMatch.name, status: donorMatch.status, details: donorMatch.blood_group + ' donor' })
    } else if (requestMatch) {
      setResult({ type: 'Blood Request', name: requestMatch.patient_name, status: requestMatch.status, details: requestMatch.units + ' units of ' + requestMatch.blood_group })
    } else {
      setResult(null)
    }
    setSearched(true)
  }

  return (
    <div className="page-section">
      <h2 className="section-title">Track Status</h2>
      <p className="info-note">Enter your DON- or REQ- reference code to check your status.</p>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          className="search-input"
          placeholder="e.g. DON-X1Y2Z3 or REQ-A1B2C3"
          value={refCode}
          onChange={(e) => setRefCode(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Track</button>
      </form>

      {searched && (
        result ? (
          <div className="card text-center">
            <h3>{result.type} Found</h3>
            <p className="mt-20"><b>Name/Patient:</b> {result.name}</p>
            <p><b>Details:</b> {result.details}</p>
            <p className="mt-20">
              <b>Status:</b>{' '}
              <span className={'status-badge status-' + result.status.toLowerCase()}>
                {result.status}
              </span>
            </p>
          </div>
        ) : (
          <p className="empty-message">No record found with reference code "{refCode.trim().toUpperCase()}"</p>
        )
      )}
    </div>
  )
}