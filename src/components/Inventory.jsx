import { GROUPS, LOW_STOCK } from '../data'

export default function Inventory({ inventory }) {
  function stockClass(units) {
    if (units === 0) return 'stock-empty'
    if (units <= LOW_STOCK) return 'stock-low'
    return 'stock-ok'
  }

  return (
    <div className="page-section">
      <h2 className="section-title">Blood Inventory</h2>
      <p className="info-note">Live stock, updated by the blood bank staff.</p>

      <div className="inventory-grid">
        {GROUPS.map((g) => {
          const units = inventory[g] || 0
          return (
            <div className={'inventory-card card ' + stockClass(units)} key={g}>
              <div className="inventory-group">{g}</div>
              <div className="inventory-units">{units} units</div>
              {units === 0 && <p className="stock-warning">Out of stock</p>}
              {units > 0 && units <= LOW_STOCK && <p className="stock-warning">⚠ Low stock</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}