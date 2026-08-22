import { useState } from 'react'
import { Volume2, BookOpen, Sparkles, MessageCircle, HelpCircle, Check } from 'lucide-react'

const PHRASES = [
  {
    gujarati: 'કેમ છો? (Kem cho?)',
    english: 'How are you?',
    meaning: 'Friendly greeting used everywhere in Gujarat',
    audioText: 'Kem cho'
  },
  {
    gujarati: 'મજામાં! (Majama!)',
    english: "I am fine / All good!",
    meaning: 'Universal cheerful response to Kem cho',
    audioText: 'Majama'
  },
  {
    gujarati: 'આભાર (Aabhar / Dhanyavaad)',
    english: 'Thank you very much',
    meaning: 'Polite expression of gratitude',
    audioText: 'Aabhar'
  },
  {
    gujarati: 'આ કેટલા રૂપિયાનું છે? (Aa ketla rupiyanu chhe?)',
    english: 'How much does this cost?',
    meaning: 'Essential for shopping in markets like Law Garden or Surat Bazaar',
    audioText: 'Aa ketla rupiyanu chhe'
  },
  {
    gujarati: 'ખૂબ સરસ! (Khub saras!)',
    english: 'Very good / Wonderful!',
    meaning: 'Compliment food (like Dhokla, Jalebi) or sights',
    audioText: 'Khub saras'
  },
  {
    gujarati: 'જમવાનું બહુ સ્વાદિષ્ટ છે! (Jamvanu bahu swadisht chhe!)',
    english: 'The food is extremely delicious!',
    meaning: 'High praise for Gujarati Thali hosts',
    audioText: 'Jamvanu bahu swadisht chhe'
  },
  {
    gujarati: 'નમસ્તે (Namaste)',
    english: 'Hello / Respectful Salutation',
    meaning: 'Traditional respectful greeting with folded hands',
    audioText: 'Namaste'
  }
]

export default function LanguagePhrasebook() {
  const [copiedIdx, setCopiedIdx] = useState(null)

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  const copyPhrase = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} color="var(--color-primary)" />
            Local Gujarati & Indian Travel Phrasebook
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Helpful everyday expressions with voice pronunciation for travelers
          </p>
        </div>
        <span className="badge badge-warning">🗣️ Audio Enabled</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
        {PHRASES.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-surface2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--color-primary-light)' }}>
                {item.gujarati}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--color-text)', marginTop: 1 }}>
                "{item.english}"
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {item.meaning}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => speak(item.audioText)}
                style={{ width: 30, height: 30 }}
                title="Pronounce with Speech Audio"
              >
                <Volume2 size={13} color="var(--color-warning)" />
              </button>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => copyPhrase(item.gujarati, idx)}
                style={{ width: 30, height: 30 }}
                title="Copy to clipboard"
              >
                {copiedIdx === idx ? <Check size={13} color="var(--color-success)" /> : <MessageCircle size={13} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
