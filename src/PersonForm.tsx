import { useState } from 'react'
import { LocationAutocomplete } from './LocationAutocomplete'
import { TIMEZONES } from './timezoneData'

type Person = {
  id: string
  name: string
  email?: string
  matrix?: string
  slack?: string
  telegram?: string
  location?: string
  timezone?: string
}

type PersonFormProps = {
  onSave: (person: Person) => void
  onCancel: () => void
}

export function PersonForm({ onSave, onCancel }: PersonFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [matrix, setMatrix] = useState('')
  const [slack, setSlack] = useState('')
  const [telegram, setTelegram] = useState('')
  const [location, setLocation] = useState('')
  const [timezone, setTimezone] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    const person: Person = {
      id: `person-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || undefined,
      matrix: matrix.trim() || undefined,
      slack: slack.trim() || undefined,
      telegram: telegram.trim() || undefined,
      location: location.trim() || undefined,
      timezone: timezone.trim() || undefined,
    }

    onSave(person)
  }

  return (
    <div className="person-form-overlay" onClick={onCancel}>
      <form className="person-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Add Person</h3>
          <button type="button" className="close-button" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="form-body">
          <div className="form-field">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="person@example.com"
            />
          </div>

          <div className="form-section-title">Chat & Communication</div>

          <div className="form-field">
            <label htmlFor="slack">Slack</label>
            <input
              id="slack"
              type="text"
              value={slack}
              onChange={(e) => setSlack(e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="form-field">
            <label htmlFor="matrix">Matrix</label>
            <input
              id="matrix"
              type="text"
              value={matrix}
              onChange={(e) => setMatrix(e.target.value)}
              placeholder="@user:matrix.org"
            />
          </div>

          <div className="form-field">
            <label htmlFor="telegram">Telegram</label>
            <input
              id="telegram"
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="form-section-title">Location & Timezone</div>

          <div className="form-field">
            <label htmlFor="location">Location</label>
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              onTimezoneSelect={setTimezone}
            />
          </div>

          <div className="form-field">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="">Select timezone...</option>
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="soft-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Add Person
          </button>
        </div>
      </form>
    </div>
  )
}
