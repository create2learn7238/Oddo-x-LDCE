import { Plane, Calendar, MapPin, Shield, Printer, Check, QrCode } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TravelVoucher({ trip, user }) {
  const { formatPrice } = useApp()
  if (!trip) return null

  const firstCity = trip.stops?.[0]?.cityName || 'Origin'
  const lastCity = trip.stops?.[trip.stops?.length - 1]?.cityName || 'Destination'
  const totalNights = trip.stops?.reduce((acc, s) => {
    const nights = Math.max(0, Math.ceil((new Date(s.endDate)-new Date(s.startDate))/(1000*60*60*24)))
    return acc + nights
  }, 0) || 0

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plane size={20} color="var(--color-primary)" />
            Official Travel Voucher & Boarding Pass
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Print-ready summary pass for check-in counters and hotels
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
          <Printer size={14} /> Print Voucher
        </button>
      </div>

      {/* Styled Boarding Pass Voucher Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface3) 0%, var(--color-surface2) 100%)',
        border: '2px dashed var(--color-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6) var(--space-8)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Header Row */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.8rem' }}>✈️</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-lg)', letterSpacing: '0.04em' }}>
                GLOBETROTTER VIP TRAVEL PASS
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-primary-light)', textTransform: 'uppercase' }}>
                Confirmed Electronic Itinerary Voucher
              </div>
            </div>
          </div>
          <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: 'var(--fs-xs)' }}>
            CONFIRMED
          </span>
        </div>

        {/* Route Big Display */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Departure</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-2xl)', color: 'var(--color-text)' }}>
              {firstCity}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-primary-light)' }}>
              {trip.startDate}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{totalNights} Nights · {trip.stops?.length} Stops</div>
            <div style={{ width: '100%', height: 2, background: 'var(--color-primary)', position: 'relative', margin: '6px 0' }}>
              <Plane size={14} color="var(--color-warning)" style={{ position: 'absolute', top: -6, left: '45%' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-success)' }}>All Reserved</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Final Stop</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-2xl)', color: 'var(--color-text)' }}>
              {lastCity}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-primary-light)' }}>
              {trip.endDate}
            </div>
          </div>
        </div>

        {/* Passenger & Reservation Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-5)' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Lead Traveler</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{user?.name || 'Alex Morgan'}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Voucher Ref</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--color-warning)' }}>GT-{trip.id?.slice(-6).toUpperCase()}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Budget Class</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>First Class Custom</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>24x7 Support</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--color-success)' }}>1800 200 5080</div>
          </div>
        </div>

        {/* Simulated Barcode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.75, flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ fontFamily: 'monospace', letterSpacing: '4px', fontSize: '13px' }}>
            ||| | |||| || ||| |||| | || ||||| ||| ||||
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
            Present at accommodation check-in desks
          </div>
        </div>
      </div>
    </div>
  )
}
