import { useState, useRef, useEffect } from 'react'
import { CITY_LOCATIONS, CityLocation } from './timezoneData'

type LocationAutocompleteProps = {
  value: string
  onChange: (location: string) => void
  onTimezoneSelect: (timezone: string) => void
}

export function LocationAutocomplete({ value, onChange, onTimezoneSelect }: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<CityLocation[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length >= 2) {
      const searchTerm = value.toLowerCase()
      const matches = CITY_LOCATIONS.filter(
        (loc) =>
          loc.city.toLowerCase().includes(searchTerm) ||
          loc.country.toLowerCase().includes(searchTerm) ||
          loc.displayName.toLowerCase().includes(searchTerm)
      ).slice(0, 10)
      setFilteredLocations(matches)
      setIsOpen(matches.length > 0)
    } else {
      setFilteredLocations([])
      setIsOpen(false)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (location: CityLocation) => {
    onChange(location.displayName)
    onTimezoneSelect(location.timezone)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < filteredLocations.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredLocations.length) {
          handleSelect(filteredLocations[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        id="location"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type to search cities..."
        autoComplete="off"
      />
      {isOpen && filteredLocations.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            marginTop: '4px',
            maxHeight: '240px',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          {filteredLocations.map((location, index) => (
            <div
              key={`${location.city}-${location.country}`}
              onClick={() => handleSelect(location)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                backgroundColor: highlightedIndex === index ? '#f5f5f5' : 'white',
                borderBottom: index < filteredLocations.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background-color 0.15s',
              }}
            >
              <div style={{ fontWeight: 500, color: '#333' }}>{location.city}</div>
              <div style={{ fontSize: '0.85em', color: '#666', marginTop: '2px' }}>
                {location.country} • {location.timezone}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
