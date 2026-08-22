import { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, Plus, Check, Filter, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Priya Sharma',
    city: 'Rann of Kutch',
    rating: 5,
    date: '2 days ago',
    tag: 'Photography Hotspot',
    comment: 'The full moon night at the White Desert was completely otherworldly! Booking the Dhordo luxury tents in advance made our family trip hassle-free.',
    likes: 24
  },
  {
    id: 'rev-2',
    author: 'Parth Patel',
    city: 'Gir National Park',
    rating: 5,
    date: '5 days ago',
    tag: 'Wildlife Adventure',
    comment: 'We spotted a mother Asiatic Lioness with two cubs on our morning 6 AM safari in Sasan Gir! Highly recommend carrying a telephoto lens.',
    likes: 19
  },
  {
    id: 'rev-3',
    author: 'Elena Rostova',
    city: 'Ahmedabad',
    rating: 5,
    date: '1 week ago',
    tag: 'Heritage & Food',
    comment: 'The Old City Pols heritage walk and evening street food feast at Manek Chowk was the highlight of our India trip! Incredible hospitality.',
    likes: 31
  },
  {
    id: 'rev-4',
    author: 'Rohan Mehta',
    city: 'Statue of Unity',
    rating: 4,
    date: '2 weeks ago',
    tag: 'Must Visit',
    comment: 'The viewing gallery at 153m inside the chest of Sardar Patel gives panoramic views of the Sardar Sarovar Dam and Narmada river valley.',
    likes: 15
  }
]

export default function TravelerReviews() {
  const { user, showToast } = useApp()
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [liked, setLiked] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newCity, setNewCity] = useState('Ahmedabad')
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [newTag, setNewTag] = useState('Recommended')

  const handleLike = (id) => {
    setLiked(prev => {
      const isLiked = !prev[id]
      setReviews(rList => rList.map(r => r.id === id ? { ...r, likes: r.likes + (isLiked ? 1 : -1) } : r))
      return { ...prev, [id]: isLiked }
    })
  }

  const handleAddReview = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const rev = {
      id: `rev-${Date.now()}`,
      author: user?.name || 'Verified Explorer',
      city: newCity,
      rating: newRating,
      date: 'Just now',
      tag: newTag,
      comment: newComment.trim(),
      likes: 0
    }

    setReviews([rev, ...reviews])
    setNewComment('')
    setShowAdd(false)
    showToast('Your traveler review has been posted!', 'success')
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={20} color="var(--color-primary)" />
            Verified Traveler Reviews & Experience Feed
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Real reviews, photography tips, and travel feedback from verified explorers
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} /> {showAdd ? 'Cancel' : 'Write Review'}
        </button>
      </div>

      {/* Add Review Modal / Drawer */}
      {showAdd && (
        <form onSubmit={handleAddReview} style={{
          background: 'var(--color-surface2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          animation: 'fadeIn 200ms both'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Destination</label>
              <select className="form-input" style={{ fontSize: 'var(--fs-xs)' }} value={newCity} onChange={e => setNewCity(e.target.value)}>
                {['Ahmedabad', 'Rann of Kutch', 'Gir National Park', 'Statue of Unity', 'Somnath', 'Dwarka', 'Surat', 'Vadodara'].map(c => (
                  <option key={c} value={c} style={{ background: 'var(--color-surface)' }}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Experience Tag</label>
              <select className="form-input" style={{ fontSize: 'var(--fs-xs)' }} value={newTag} onChange={e => setNewTag(e.target.value)}>
                {['Recommended', 'Photography Hotspot', 'Wildlife Adventure', 'Heritage & Food', 'Family Friendly', 'Budget Gem'].map(t => (
                  <option key={t} value={t} style={{ background: 'var(--color-surface)' }}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Your Review & Advice</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Share highlights, tips, or what to avoid..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              required
            />
          </div>

          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  style={{ color: star <= newRating ? 'var(--color-warning)' : 'var(--color-text-faint)' }}
                >
                  <Star size={16} fill={star <= newRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} /> Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {reviews.map(rev => {
          const isUserLiked = !!liked[rev.id]
          return (
            <div
              key={rev.id}
              style={{
                padding: 'var(--space-4) var(--space-5)',
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                      {rev.author[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--fs-xs)' }}>{rev.author}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{rev.date}</div>
                    </div>
                  </div>

                  <span className="badge badge-warning" style={{ fontSize: '10px' }}>
                    {rev.tag}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ display: 'flex', color: 'var(--color-warning)' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                    📍 {rev.city}
                  </span>
                </div>

                <p style={{ color: 'var(--color-text)', fontSize: 'var(--fs-xs)', lineHeight: 1.45, marginBottom: 'var(--space-3)' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2)' }}>
                <button
                  onClick={() => handleLike(rev.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '11px',
                    color: isUserLiked ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <ThumbsUp size={12} fill={isUserLiked ? 'currentColor' : 'none'} />
                  Helpful ({rev.likes})
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
