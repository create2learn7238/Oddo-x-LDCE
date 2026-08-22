import { useState } from 'react'
import { UtensilsCrossed, Star, MapPin, Sparkles, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'

const DELICACIES = [
  {
    name: 'Authentic Gujarati Thali',
    city: 'Ahmedabad / Statewide',
    type: 'Pure Veg Feast',
    tag: 'Must Try',
    emoji: '🍱',
    price: 8,
    desc: 'Grand royal assortment with Gujarati Kadhi, Rotli, 4 seasonal Shaak, Dhokla, Dal, Farsan, and Aamras/Basundi.',
    bestSpots: 'Agashiye (House of MG), Vishalla, Sasuma'
  },
  {
    name: 'Surati Locho & Butter Sev Khamani',
    city: 'Surat',
    type: 'Street Food Specialty',
    tag: 'Iconic Breakfast',
    emoji: '🧀',
    price: 2,
    desc: 'Steamed spiced gram flour delicacy smothered in butter, garlic chutney, and crunchy sev.',
    bestSpots: 'Jaani Locho, Gopal Khaman, Surat Chowk Bazaar'
  },
  {
    name: 'Kutchi Dabeli with Roast Peanuts',
    city: 'Rann of Kutch / Mandvi',
    type: 'Spiced Street Bun',
    tag: 'World Famous',
    emoji: '🍔',
    price: 1.5,
    desc: 'Pav stuffed with spiced potato masala, sweet pomegranate, roasted peanuts, and tamarind chutney.',
    bestSpots: 'Mandvi Tower Chowk, Bhuj Bazar'
  },
  {
    name: 'Kathiyawadi Ringan Oro & Bajra Rotlo',
    city: 'Gir / Rajkot / Somnath',
    type: 'Rustic Village Cuisine',
    tag: 'Spicy & Hearty',
    emoji: '🍲',
    price: 5,
    desc: 'Smoked roasted eggplant mash prepared in cold-pressed oil with whole garlic, served with thick pearl-millet flatbread and fresh white butter (Makhan).',
    bestSpots: 'Gir Jungle Lodges, Honest Dhaba Rajkot Highway'
  },
  {
    name: 'Fafda & Jalebi with Papaya Sambharo',
    city: 'Ahmedabad / Vadodara',
    type: 'Sunday Ritual Snack',
    tag: 'Crunchy Sweet Pair',
    emoji: '🥨',
    price: 3,
    desc: 'Crispy besan ribbons paired with piping hot spirals of sugar syrup jalebi and fried green chillies.',
    bestSpots: 'Chandravilas (since 1900), Oswal, Das Khaman'
  },
  {
    name: 'Patan Nu Deva Patra & Handvo',
    city: 'Patan / North Gujarat',
    type: 'Healthy Baked Snack',
    tag: 'Heritage Recipe',
    emoji: '🥮',
    price: 2.5,
    desc: 'Savory multi-grain vegetable cake with sesame tempering and colacassia leaf rolls.',
    bestSpots: 'Patan Old Town Street Markets'
  }
]

export default function CuisineGuide() {
  const { formatPrice, showToast } = useApp()
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [savedFood, setSavedFood] = useState({})

  const toggleSave = (name) => {
    setSavedFood(prev => {
      const next = { ...prev, [name]: !prev[name] }
      showToast(next[name] ? `Saved "${name}" to Food Wishlist!` : `Removed "${name}"`, 'info')
      return next
    })
  }

  const cities = ['All', 'Ahmedabad', 'Surat', 'Kutch', 'Gir / Kathiyawad']
  const filtered = selectedFilter === 'All'
    ? DELICACIES
    : DELICACIES.filter(d => d.city.toLowerCase().includes(selectedFilter.toLowerCase()))

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UtensilsCrossed size={20} color="var(--color-warning)" />
            Culinary & Street Food Gourmet Guide
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Iconic regional dishes, authentic local food joints, and pricing guides
          </p>
        </div>

        {/* City Filter Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setSelectedFilter(c)}
              className={`chip ${selectedFilter === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map(food => {
          const isSaved = !!savedFood[food.name]
          return (
            <div
              key={food.name}
              style={{
                padding: 'var(--space-5)',
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '2rem' }}>{food.emoji}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="badge badge-warning" style={{ fontSize: '10px' }}>
                      {formatPrice(food.price)} avg
                    </span>
                    <button
                      onClick={() => toggleSave(food.name)}
                      className="btn btn-ghost btn-icon"
                      style={{ width: 28, height: 28, color: isSaved ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 'var(--fs-base)', marginBottom: 2 }}>
                  {food.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-primary-light)', fontWeight: 600, marginBottom: 6 }}>
                  📍 {food.city} · <span style={{ color: 'var(--color-text-muted)' }}>{food.type}</span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', lineHeight: 1.4, marginBottom: 'var(--space-3)' }}>
                  {food.desc}
                </p>
              </div>

              <div style={{ background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', padding: '6px 10px', fontSize: '11px', color: 'var(--color-text)' }}>
                <strong style={{ color: 'var(--color-warning)' }}>Where to Eat:</strong> {food.bestSpots}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
