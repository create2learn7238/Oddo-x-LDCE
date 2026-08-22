import { useState } from 'react'
import { Camera, Star, Heart, Plus, Edit2, Trash2, Check, Sparkles, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TravelJournal({ tripId }) {
  const { showToast } = useApp()
  const storageKey = `gt_journal_${tripId}`

  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Sunset at White Rann', note: 'Witnessed the full moon rising over the endless white salt desert in Kutch. Absolutely breathtaking experience with live folk music.', date: 'Day 2', rating: 5, photoUrl: null }
      ]
    } catch {
      return []
    }
  })

  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [rating, setRating] = useState(5)
  const [showAdd, setShowAdd] = useState(false)

  const handleAddEntry = (e) => {
    e.preventDefault()
    if (!title.trim() || !note.trim()) return

    const newEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      note: note.trim(),
      date: `Day ${entries.length + 1}`,
      rating,
      createdAt: new Date().toLocaleDateString()
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setTitle('')
    setNote('')
    setShowAdd(false)
    showToast('Memory logged to Travel Journal!', 'success')
  }

  const handleDelete = (id) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} color="var(--color-primary)" />
            Travel Journal & Trip Highlights
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Capture moments, personal reviews, and highlight experiences for this journey
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} /> {showAdd ? 'Close' : 'Log New Memory'}
        </button>
      </div>

      {/* Add Memory Form */}
      {showAdd && (
        <form onSubmit={handleAddEntry} style={{
          background: 'var(--color-surface2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          animation: 'fadeIn 200ms both'
        }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Memory Title</label>
            <input
              className="form-input"
              placeholder="e.g. Asiatic Lion Sighting in Sasan Gir"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Experience & Story</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Describe your unforgettable highlight..."
              value={note}
              onChange={e => setNote(e.target.value)}
              required
            />
          </div>

          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Experience Rating:</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ color: star <= rating ? 'var(--color-warning)' : 'var(--color-text-faint)' }}
                  >
                    <Star size={16} fill={star <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} /> Save Memory
            </button>
          </div>
        </form>
      )}

      {/* Memories Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
            No journal entries yet. Click "Log New Memory" to preserve your favorite moments!
          </div>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              style={{
                padding: 'var(--space-5)',
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-4)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 4 }}>
                  <span className="badge badge-primary">{entry.date}</span>
                  <div style={{ display: 'flex', color: 'var(--color-warning)' }}>
                    {Array.from({ length: entry.rating || 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--fs-base)', marginBottom: 4 }}>
                  {entry.title}
                </div>
                <p style={{ color: 'var(--color-text)', fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                  {entry.note}
                </p>
              </div>

              <button
                className="btn btn-ghost btn-icon"
                onClick={() => handleDelete(entry.id)}
                style={{ color: 'var(--color-danger)' }}
                title="Delete entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
