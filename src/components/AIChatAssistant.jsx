import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, Sparkles, X, Compass, HelpCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const FAQ_KNOWLEDGE = [
  {
    q: 'When is the best time to visit Rann of Kutch (Rann Utsav)?',
    a: 'The ideal time is from November to February during the official Rann Utsav festival. Visiting during Full Moon nights offers magical white salt desert reflections!'
  },
  {
    q: 'What is the dress code for Somnath and Dwarka Temples?',
    a: 'Modest traditional attire is recommended (shoulders and knees covered). Avoid leather items inside the inner sanctum. Photography is prohibited inside the main shrine.'
  },
  {
    q: 'How to book Asiatic Lion Safari in Gir National Park?',
    a: 'Safaris must be booked in advance via the official forest department portal (girlion.gujarat.gov.in). Morning slots (06:00 AM - 09:00 AM) offer the highest lion sighting chances!'
  },
  {
    q: 'What are the top must-try vegetarian dishes in Gujarat?',
    a: 'Do not miss: Authentic Gujarati Thali (with Kadhi & Basundi), Surati Locho, Kutchi Dabeli, Kathiyawadi Ringan No Oro with Bajra Rotlo, and hot Fafda-Jalebi on Sunday mornings!'
  },
  {
    q: 'What is the best way to travel between Ahmedabad and Statue of Unity?',
    a: 'You can take the direct Jan Shatabdi / Vande Bharat Express to Ekta Nagar (Kevadia) Station in ~2.5 hours, or take a scenic highway drive (approx. 195 km, 3.5 hrs).'
  }
]

export default function AIChatAssistant() {
  const { user } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste ${user?.name?.split(' ')[0] || 'Traveler'}! 🙏 I am your GlobeTrotter AI Travel Concierge. Ask me anything about Gujarat destinations, travel itineraries, culture, food, or packing tips!`
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = (userQuestion) => {
    const query = (userQuestion || input).trim()
    if (!query) return

    setMessages(prev => [...prev, { sender: 'user', text: query }])
    if (!userQuestion) setInput('')
    setTyping(true)

    setTimeout(() => {
      // Find matching knowledge or generate intelligent answer
      const lower = query.toLowerCase()
      let reply = "That's a wonderful travel plan! Gujarat offers incredible hospitality, UNESCO heritage architecture, scenic deserts, and rich wildlife. Make sure to schedule buffer time for street food tours and sunset viewpoints!"

      const match = FAQ_KNOWLEDGE.find(k =>
        lower.split(' ').some(w => w.length > 3 && k.q.toLowerCase().includes(w))
      )

      if (match) {
        reply = match.a
      } else if (lower.includes('ahmedabad')) {
        reply = "In Ahmedabad, explore the Old City Pols (Heritage Walk), Sabarmati Gandhi Ashram, Adalaj Stepwell, and enjoy street food at Manek Chowk night market!"
      } else if (lower.includes('weather') || lower.includes('pack')) {
        reply = "During winter (Nov-Feb), daytime is pleasant (~28°C) while desert/wildlife nights can get cool (~14°C). Pack light cottons with a jacket or shawl for evenings!"
      } else if (lower.includes('budget') || lower.includes('cost')) {
        reply = "Gujarat is very budget-friendly! Mid-range travel costs around $40 - $75 (₹3,500 - ₹6,500) per day including comfortable stays, delicious meals, and local transit."
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }])
      setTyping(false)
    }, 700)
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 'var(--space-6)',
          right: 'var(--space-6)',
          width: 54,
          height: 54,
          borderRadius: 'var(--radius-full)',
          background: 'var(--grad-primary)',
          color: '#fff',
          boxShadow: '0 6px 24px var(--color-primary-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          border: '2px solid rgba(255,255,255,0.2)',
          transition: 'all var(--transition-base)',
          transform: isOpen ? 'scale(0.95)' : 'scale(1)'
        }}
        title="AI Travel Concierge"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Window Box */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 96,
          right: 'var(--space-6)',
          width: 380,
          maxWidth: 'calc(100vw - 32px)',
          height: 520,
          maxHeight: 'calc(100vh - 120px)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          overflow: 'hidden',
          animation: 'scaleIn 200ms both'
        }}>
          {/* Header */}
          <div style={{
            padding: 'var(--space-4) var(--space-5)',
            background: 'var(--grad-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>AI Travel Concierge</div>
                <div style={{ fontSize: '10px', opacity: 0.9 }}>Gujarat & India Explorer</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#fff', opacity: 0.8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Quick FAQ Chips */}
          <div style={{
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--color-surface2)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {['Rann Utsav Guide', 'Gir Lion Safari', 'Somnath Dress Code', 'Best Food'].map(chip => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                style={{
                  fontSize: '10px',
                  background: 'var(--color-surface3)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-primary-light)',
                  border: '1px solid var(--color-border)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                ✨ {chip}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: 'var(--space-4)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? 'var(--color-primary)' : 'var(--color-surface2)',
                  color: m.sender === 'user' ? '#fff' : 'var(--color-text)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--fs-xs)',
                  lineHeight: 1.45,
                  border: `1px solid ${m.sender === 'user' ? 'transparent' : 'var(--color-border)'}`,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {m.text}
              </div>
            ))}

            {typing && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--color-surface2)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: 4
              }}>
                <span className="spinner" style={{ width: 12, height: 12 }} />
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            style={{
              padding: 'var(--space-3)',
              background: 'var(--color-surface2)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: 'var(--space-2)'
            }}
          >
            <input
              className="form-input"
              style={{ padding: '8px 12px', fontSize: 'var(--fs-xs)', borderRadius: 'var(--radius-md)' }}
              placeholder="Ask about cities, food, culture..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 12px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
