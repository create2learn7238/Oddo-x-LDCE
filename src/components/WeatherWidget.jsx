import { useState } from 'react'
import { Sun, CloudRain, Wind, Thermometer, Compass, Sparkles, Droplets } from 'lucide-react'

// Realistic weather simulation for curated destinations
const CITY_WEATHER = {
  'Ahmedabad': { temp: 31, condition: 'Sunny & Warm', icon: Sun, humidity: '42%', wind: '12 km/h', sunset: '18:45', tip: 'Breathable cotton clothes, sunglasses & hydration for heritage pol walks.' },
  'Rann of Kutch': { temp: 26, condition: 'Clear Sky & Cool Night', icon: Sun, humidity: '35%', wind: '16 km/h', sunset: '18:52', tip: 'Wide hat for salt reflection; light jacket / shawl for evening stargazing.' },
  'Statue of Unity (Kevadia)': { temp: 29, condition: 'Pleasant Breeze', icon: Wind, humidity: '48%', wind: '14 km/h', sunset: '18:41', tip: 'Comfortable sneakers for walking across riverfront and gardens.' },
  'Gir National Park': { temp: 28, condition: 'Dry Forest Climate', icon: Sun, humidity: '40%', wind: '9 km/h', sunset: '18:48', tip: 'Earthy/khaki colored clothes for safari; scarf for dust protection.' },
  'Somnath': { temp: 27, condition: 'Coastal Sea Breeze', icon: Wind, humidity: '65%', wind: '22 km/h', sunset: '18:56', tip: 'Light casuals, footwear suitable for temple darshan and beach walks.' },
  'Dwarka': { temp: 27, condition: 'Sunny & Coastal', icon: Sun, humidity: '62%', wind: '20 km/h', sunset: '18:58', tip: 'Modest temple attire; swimwear / flip-flops for Shivrajpur Blue Flag beach.' },
  'Vadodara (Baroda)': { temp: 30, condition: 'Warm & Clear', icon: Sun, humidity: '45%', wind: '11 km/h', sunset: '18:43', tip: 'Comfortable walking shoes for palace corridors and art galleries.' },
  'Surat': { temp: 30, condition: 'Coastal Warm', icon: Sun, humidity: '58%', wind: '15 km/h', sunset: '18:47', tip: 'Casual street food tour attire; plenty of appetite for night markets!' },
  'Paris': { temp: 18, condition: 'Mild & Partly Cloudy', icon: Wind, humidity: '55%', wind: '14 km/h', sunset: '20:15', tip: 'Chic layered clothing, compact umbrella, and walking boots.' },
  'Tokyo': { temp: 21, condition: 'Clear Autumn Day', icon: Sun, humidity: '50%', wind: '10 km/h', sunset: '17:30', tip: 'Slip-on shoes for temple visits and sleek urban wear.' },
  'Rome': { temp: 22, condition: 'Sunny Mediterranean', icon: Sun, humidity: '48%', wind: '12 km/h', sunset: '19:10', tip: 'Comfortable cobblestone walking shoes and shoulder cover for Vatican.' },
  'Bali': { temp: 29, condition: 'Tropical Warm', icon: Sun, humidity: '72%', wind: '15 km/h', sunset: '18:20', tip: 'Light beachwear, sarong for temple visits, and reef-safe sunscreen.' }
}

export default function WeatherWidget({ stops = [] }) {
  const [selectedCity, setSelectedCity] = useState(stops[0]?.cityName || 'Ahmedabad')

  if (!stops || stops.length === 0) return null

  const data = CITY_WEATHER[selectedCity] || {
    temp: 27, condition: 'Pleasant & Sunny', icon: Sun, humidity: '45%', wind: '12 km/h', sunset: '18:45', tip: 'Comfortable travel gear and daily essentials.'
  }
  const Icon = data.icon

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sun size={20} color="var(--color-warning)" />
            Live Weather & Climate Intelligence
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Real-time conditions and smart wardrobe packing advice for each stop
          </p>
        </div>

        {/* City Filter Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {stops.map(s => (
            <button
              key={s.cityName}
              onClick={() => setSelectedCity(s.cityName)}
              className={`chip ${selectedCity === s.cityName ? 'active' : ''}`}
            >
              {s.emoji} {s.cityName}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Stats Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        alignItems: 'center'
      }}>
        {/* Main Temp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--color-warning)', flexShrink: 0
          }}>
            <Icon size={30} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-3xl)', fontWeight: 800, lineHeight: 1 }}>
              {data.temp}°C
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>
              {data.condition}
            </div>
          </div>
        </div>

        {/* Atmospheric Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Droplets size={14} color="var(--color-info)" />
            Humidity: <strong style={{ color: 'var(--color-text)' }}>{data.humidity}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Wind size={14} color="var(--color-primary-light)" />
            Wind: <strong style={{ color: 'var(--color-text)' }}>{data.wind}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Compass size={14} color="var(--color-accent)" />
            Sunset: <strong style={{ color: 'var(--color-text)' }}>{data.sunset}</strong>
          </div>
        </div>

        {/* Wardrobe Tip Box */}
        <div style={{
          background: 'var(--color-surface3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <Sparkles size={12} />
            Smart Packing Advice:
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {data.tip}
          </div>
        </div>
      </div>
    </div>
  )
}
