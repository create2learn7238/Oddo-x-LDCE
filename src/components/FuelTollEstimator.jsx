import { useState } from 'react'
import { Car, Zap, Fuel, DollarSign, MapPin, Navigation, Coffee, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ROUTES_DATA = {
  'ahmedabad-sou': { name: 'Ahmedabad ➔ Statue of Unity (Ekta Nagar)', distance: 198, tolls: 2, tollCost: 220, scenic: 'NE-1 & State Expressway' },
  'ahmedabad-gir': { name: 'Ahmedabad ➔ Sasan Gir National Park', distance: 350, tolls: 4, tollCost: 460, scenic: 'NH-27 via Rajkot & Junagadh' },
  'ahmedabad-kutch': { name: 'Ahmedabad ➔ Dhordo (White Rann of Kutch)', distance: 410, tolls: 5, tollCost: 540, scenic: 'NH-947 via Bhuj & Viramgam' },
  'somnath-dwarka': { name: 'Somnath Coastal Route ➔ Dwarkadhish', distance: 235, tolls: 2, tollCost: 280, scenic: 'Scenic Arabian Sea Coastal Highway' }
}

export default function FuelTollEstimator() {
  const { formatPrice } = useApp()
  const [selectedRoute, setSelectedRoute] = useState('ahmedabad-kutch')
  const [vehicle, setVehicle] = useState('diesel') // petrol (₹96.5/L, 14kmpl), diesel (₹92.2/L, 18kmpl), ev (₹4.5/km)

  const route = ROUTES_DATA[selectedRoute] || ROUTES_DATA['ahmedabad-kutch']

  let fuelCost = 0
  if (vehicle === 'petrol') {
    fuelCost = Math.round((route.distance / 14) * 96.5 / 86.5) // in USD equivalent
  } else if (vehicle === 'diesel') {
    fuelCost = Math.round((route.distance / 18) * 92.2 / 86.5)
  } else {
    fuelCost = Math.round((route.distance * 4.5) / 86.5)
  }

  const tollUsd = Math.round(route.tollCost / 86.5)
  const totalRoadTripCost = fuelCost + tollUsd

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Car size={20} color="var(--color-primary)" />
            Road Trip Fuel, Fastag Toll & Highway Calculator
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Accurate highway fuel consumption, EV charging, and Fastag toll plaza estimates
          </p>
        </div>

        <span className="badge badge-success">🚗 Fastag Auto-Tolls</span>
      </div>

      {/* Selectors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-5)'
      }}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Popular Highway Route</label>
          <select className="form-input" value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
            {Object.entries(ROUTES_DATA).map(([k, r]) => (
              <option key={k} value={k} style={{ background: 'var(--color-surface)' }}>{r.name} ({r.distance} km)</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Vehicle Propulsion</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'diesel', label: 'Diesel SUV', icon: '🚙' },
              { id: 'petrol', label: 'Petrol Sedan', icon: '🚗' },
              { id: 'ev', label: 'Electric EV', icon: '⚡' }
            ].map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicle(v.id)}
                className={`chip ${vehicle === v.id ? 'active' : ''}`}
                style={{ fontSize: '10px', padding: '3px 8px' }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Driving Distance</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', color: 'var(--color-text)' }}>
            {route.distance} km
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-primary-light)' }}>
            🛣️ {route.scenic}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fuel / Energy Cost</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', color: 'var(--color-warning)' }}>
            {formatPrice(fuelCost)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {vehicle === 'ev' ? 'Fast DC Charging' : `~₹${Math.round(fuelCost * 86.5)} INR`}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fastag Tolls</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', color: 'var(--color-info)' }}>
            {formatPrice(tollUsd)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {route.tolls} Toll Plazas (₹{route.tollCost} INR)
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-glow)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-primary-light)', textTransform: 'uppercase', fontWeight: 700 }}>Total Estimated Transit</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', color: 'var(--color-primary-light)' }}>
            {formatPrice(totalRoadTripCost)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            ~₹{Math.round(totalRoadTripCost * 86.5)} INR all-inclusive
          </div>
        </div>
      </div>
    </div>
  )
}
