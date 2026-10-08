import { useState } from 'react'
import { GROUPS, IMAGES, PATTERNS } from '../data'

const emptyForm = {
  name: '', dob: '', gender: 'Male', blood_group: 'A+',
  phone: '', email: '', aadhaar: '', address: '', city: '', pincode: '',
  weight: '', last_donation: '', agree: false,
}

function getAge(dob) {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function Donate({ addDonor }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const aadhaar = form.aadhaar.replace(/\s/g, '')

    // ---------- VALIDATION ----------
    if (!PATTERNS.name.test(form.name.trim())) return setError('Name: letters only, 3 to 40 characters')
    if (!form.dob) return setError('Date of birth is required')
    const age = getAge(form.dob)
    if (age < 18 || age > 65) return setError('Donor must be between 18 and 65 years old')
    if (!PATTERNS.aadhaar.test(aadhaar)) return setError('Aadhaar must be 12 digits and cannot start with 0 or 1')
    if (!PATTERNS.phone.test(form.phone)) return setError('Phone must be 10 digits starting with 6, 7, 8 or 9')
    if (form.email && !PATTERNS.email.test(form.email)) return setError('Enter a valid email address')
    if (form.address.trim().length < 10) return setError('Please enter your full address (at least 10 characters)')
    if (form.city.trim() === '') return setError('City is required')
    if (!PATTERNS.pincode.test(form.pincode)) return setError('Pincode must be 6 digits')
    if (Number(form.weight) < 45) return setError('Donor weight must be at least 45 kg')
    if (!form.agree) return setError('Please confirm the details are correct')

    const ref = 'DON-' + Math.random().toString(36).slice(2, 8).toUpperCase()

    const err = await addDonor({
      ref_code: ref,
      name: form.name.trim(),
      dob: form.dob,
      gender: form.gender,
      blood_group: form.blood_group,
      phone: form.phone,
      email: form.email || null,
      aadhaar_masked: 'XXXX XXXX ' + aadhaar.slice(-4),
      address: form.address.trim(),
      city: form.city.trim(),
      pincode: form.pincode,
      weight: Number(form.weight),
      last_donation: form.last_donation || null,
      status: 'Pending',
    })

    if (err) {
      return setError(err.code === '23505' ? 'This phone number is already registered' : err.message)
    }

    setError('')
    setConfirmed({ ref, name: form.name.trim(), blood_group: form.blood_group, city: form.city.trim() })
    setForm(emptyForm)
  }

  // ---------- CONFIRMATION SCREEN ----------
  if (confirmed) {
    return (
      <div className="page-section">
        <div className="card confirm-box">
          <div className="confirm-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>Thank you, <b>{confirmed.name}</b> ({confirmed.blood_group}, {confirmed.city}).</p>
          <p>Your reference code is:</p>
          <div className="ref-code">{confirmed.ref}</div>
          <p className="info-note-center">
            Save this code. The blood bank will verify your details and contact you.
            Use the Track page to check your status.
          </p>
          <button className="btn btn-primary" onClick={() => setConfirmed(null)}>Register another donor</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <img
        className="banner-img"
        src={IMAGES.donors}
        alt="Donate blood"
        onError={(e) => (e.target.style.display = 'none')}
      />
      <h2 className="section-title">Donate Blood: Register as a Donor</h2>

      <form className="form-container card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input className="form-input" type="date" name="dob" value={form.dob} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Aadhaar Number</label>
          <input className="form-input" name="aadhaar" maxLength={14} placeholder="1234 5678 9012"
            value={form.aadhaar} onChange={handleChange} />
          <small className="form-hint">Only the last 4 digits are saved</small>
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" name="phone" maxLength={10} value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Email (optional)</label>
          <input className="form-input" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <select className="form-select" name="blood_group" value={form.blood_group} onChange={handleChange}>
            {GROUPS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input className="form-input" type="number" name="weight" value={form.weight} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Donation (optional)</label>
          <input className="form-input" type="date" name="last_donation" value={form.last_donation} onChange={handleChange} />
        </div>

        <div className="form-group form-wide">
          <label className="form-label">Full Address</label>
          <textarea className="form-input" name="address" rows={2}
            placeholder="House no, street, area" value={form.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <input className="form-input" name="city" value={form.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Pincode</label>
          <input className="form-input" name="pincode" maxLength={6} value={form.pincode} onChange={handleChange} />
        </div>

        <label className="checkbox-row">
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
          I confirm that the details above are correct and I am willing to donate blood
        </label>

        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" type="submit">Register as Donor</button>
      </form>
    </div>
  )
}