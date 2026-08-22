import { useState } from 'react'
import { FileCheck, Globe, Shield, AlertCircle, CheckCircle2, Search } from 'lucide-react'

const VISA_RULES = {
  'India': {
    'United States': { status: 'Visa on Arrival / eVisa (30 Days / 1 Year)', color: 'var(--color-info)', tip: 'Apply online at indianvisaonline.gov.in at least 4 days before travel.' },
    'United Kingdom': { status: 'eVisa Required', color: 'var(--color-info)', tip: 'Standard tourist eVisa valid for 30 days or 1 year with multiple entries.' },
    'European Union': { status: 'eVisa Required', color: 'var(--color-info)', tip: 'Quick 72-hour online processing for all EU citizens.' },
    'United Arab Emirates': { status: 'Visa on Arrival / eVisa', color: 'var(--color-success)', tip: 'Eligible for VoA at designated international airports (Delhi, Mumbai, Ahmedabad).' },
    'Japan': { status: 'Visa on Arrival (VoA)', color: 'var(--color-success)', tip: 'Instant 60-day tourist VoA at major Indian international airports.' },
    'Domestic (Indian Citizen)': { status: 'No Visa (National Travel)', color: 'var(--color-success)', tip: 'Valid Govt Photo ID (Aadhaar / Driving License / Voter ID) required for domestic flights & hotels.' }
  },
  'France (Schengen)': {
    'India': { status: 'Schengen Visa Required', color: 'var(--color-warning)', tip: 'Apply via VFS Global at least 4-6 weeks prior. Requires travel insurance with €30k coverage.' },
    'United States': { status: 'Visa Free (90 Days)', color: 'var(--color-success)', tip: 'ETIAS travel authorization valid for 90 days in any 180-day period.' },
    'United Kingdom': { status: 'Visa Free (90 Days)', color: 'var(--color-success)', tip: 'Passport must be valid for at least 3 months beyond departure.' }
  },
  'Japan': {
    'India': { status: 'eVisa (Short-term Tourist)', color: 'var(--color-info)', tip: 'Single-entry tourist eVisa available online for Indian nationals.' },
    'United States': { status: 'Visa Free (90 Days)', color: 'var(--color-success)', tip: 'No visa required for tourism stays under 90 days.' }
  },
  'United Arab Emirates': {
    'India': { status: 'eVisa / Visa on Arrival (US Visa holders)', color: 'var(--color-info)', tip: 'Indian passport holders with valid US/UK/Schengen visa get 14-day VoA.' },
    'United States': { status: 'Visa on Arrival (30 Days Free)', color: 'var(--color-success)', tip: 'Free 30-day visa stamped upon arrival at Dubai/Abu Dhabi.' }
  }
}

export default function VisaChecker() {
  const [passport, setPassport] = useState('Domestic (Indian Citizen)')
  const [destination, setDestination] = useState('India')

  const passportList = [
    'Domestic (Indian Citizen)', 'India', 'United States', 'United Kingdom', 'European Union', 'United Arab Emirates', 'Japan'
  ]
  const destList = ['India', 'France (Schengen)', 'Japan', 'United Arab Emirates']

  const rule = (VISA_RULES[destination] && VISA_RULES[destination][passport]) || {
    status: 'Standard Embassy Visa / Check Local Consulate',
    color: 'var(--color-text-muted)',
    tip: 'Check with official embassy / consulate website for latest travel advisories and entry prerequisites.'
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCheck size={20} color="var(--color-primary)" />
            Instant Visa & Entry Requirements Checker
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Verify entry regulations, validity guidelines, and eVisa links
          </p>
        </div>
        <span className="badge badge-primary">🌐 Global Intelligence</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-4)'
      }}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Your Passport / Citizenship</label>
          <select className="form-input" value={passport} onChange={e => setPassport(e.target.value)}>
            {passportList.map(p => (
              <option key={p} value={p} style={{ background: 'var(--color-surface)' }}>{p}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Destination Country</label>
          <select className="form-input" value={destination} onChange={e => setDestination(e.target.value)}>
            {destList.map(d => (
              <option key={d} value={d} style={{ background: 'var(--color-surface)' }}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Card */}
      <div style={{
        background: 'var(--color-surface3)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
            Entry Status for {passport} → {destination}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-base)', color: rule.color, marginBottom: 4 }}>
            {rule.status}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            💡 <strong style={{ color: 'var(--color-warning)' }}>Advisory:</strong> {rule.tip}
          </div>
        </div>
      </div>
    </div>
  )
}
