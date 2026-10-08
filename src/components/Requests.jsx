import { useState } from 'react'
import { GROUPS, IMAGES, PATTERNS } from '../data'

const emptyForm = {
  patient_name: '', blood_group: 'A+', units: '', hospital: '', city: '', contact: '',
}

export default function Requests({ requests, addRequest }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!PATTERNS.name.test(form.patient_name.trim())) return setError('Patient name: letters only, 3 to 40 characters')
    if (Number(form.units) < 1 || Number(form.units) > 10) return setError('Units must be between 1 and 10')
    if (form.hospital.trim().length < 3) return setError('Hospital name is required')
    if (form.city.trim() === '') return setError('City is required')
    if (!PATTERNS.phone.test(form.contact)) return setError('Contact must be a valid 10 digit phone number')

    const ref = 'REQ-' + Math.random().toString(36).slice(2, 8).toUpperCase()

    const err = await addRequest({
      ref_code: ref,
      patient_name: form.patient_name.trim(),
      blood_group: form.blood_group,
      units: Number(form.units),
      hospital: form.hospital.trim(),
      city: form.city.trim(),
      contact: form.contact,
      status: 'Pending',
    })
    if (err) return setError(err.message)

    setError('')
    setConfirmed({ ref, group: form.blood_group, units: form.units, hospital: form.hospital.trim() })
    setForm(emptyForm)
  }

  // ---------- CONFIRMATION SCREEN ----------
  if (confirmed) {
    return (
      <div className="page-section">
        <div className="card confirm-box">
          <div className="confirm-icon">✅</div>
          <h2>Request Submitted!</h2>
          <p>
            <b>{confirmed.units} unit(s)</b> of <b>{confirmed.group}</b> for <b>{confirmed.hospital}</b>.
          </p>
          <p>Your reference code is:</p>
          <div className="ref-code">{confirmed.ref}</div>
          <p className="info-note-center">
            Save this code. The blood bank will review your request and call you on your contact number.
            Use the Track page to check the status.
          </p>
          <button className="btn btn-primary" onClick={() => setConfirmed(null)}>Submit another request</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <img
        className="banner-img"
        src={IMAGES.requests}
        alt="Hospital"
        onError={(e) => (e.target.style.display = 'none')}
      />
      <h2 className="section-title">Request Blood</h2>

      <form className="form-container card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Patient Name</label>
          <input className="form-input" name="patient_name" value={form.patient_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Blood Group Needed</label>
          <select className="form-select" name="blood_group" value={form.blood_group} onChange={handleChange}>
            {GROUPS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Units Needed (1-10)</label>
          <input className="form-input" type="number" name="units" value={form.units} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Hospital</label>
          <input className="form-input" name="hospital" value={form.hospital} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <input className="form-input" name="city" value={form.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Phone</label>
          <input className="form-input" name="contact" maxLength={10} value={form.contact} onChange={handleChange} />
        </div>

        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" type="submit">Submit Request</button>
      </form>

      <h3 className="section-title">Recent Requests</h3>
      {requests.length === 0 ? (
        <p className="empty-message">No requests yet</p>
      ) : (
        <table className="data-table request-table">
          <thead>
            <tr className="table-header">
              <th>Blood</th><th>Units</th><th>Hospital</th><th>City</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr className="table-row" key={r.id}>
                <td><span className="blood-badge">{r.blood_group}</span></td>
                <td>{r.units}</td>
                <td>{r.hospital}</td>
                <td>{r.city}</td>
                <td>
                  <span className={'status-badge status-' + r.status.toLowerCase()}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}