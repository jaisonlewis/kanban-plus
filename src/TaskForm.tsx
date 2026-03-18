import { useState } from 'react'

type ColumnId = 'todo' | 'in-progress' | 'done'
type PriorityTone = 'urgent' | 'active' | 'approaching' | 'later'
type ThemeTone = 'sky' | 'mint' | 'pink' | 'violet' | 'peach'

type Project = {
  id: string
  name: string
  color: string
  icon?: string
}

type RecurringSchedule = {
  enabled: boolean
  frequency: 'weekly' | 'biweekly' | 'monthly'
  nextReturnLabel: string
  returnOnWeekday?: number
  returnOnMonthDay?: number
  lastCompletedWeek?: number
}

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

type Subtask = {
  id: string
  name: string
  status: ColumnId
}

type Task = {
  id: string
  title: string
  dueDate: string
  project: string
  status: ColumnId
  tone: ThemeTone
  priority: PriorityTone
  notes: string
  people: Person[]
  shareWith: string[]
  recurring: RecurringSchedule
  subtasks: Subtask[]
  meetingLink?: string
  meetingPassword?: string
  customColor?: string
  dueTime?: string
}

type TaskFormProps = {
  initialTask?: Task
  initialStatus: ColumnId
  onSave: (task: Omit<Task, 'id'>) => void
  onCancel: () => void
  projects?: Project[]
}

function calculatePriorityFromDate(dateString: string): PriorityTone {
  if (!dateString) return 'later'
  
  try {
    const dueDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'urgent'
    if (diffDays <= 2) return 'urgent'
    if (diffDays <= 7) return 'approaching'
    if (diffDays <= 14) return 'active'
    return 'later'
  } catch {
    return 'later'
  }
}

export function TaskForm({ initialTask, initialStatus, onSave, onCancel, projects = [] }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '')
  const [dueTime, setDueTime] = useState(initialTask?.dueTime || '')
  const [project, setProject] = useState(initialTask?.project || '')
  const [tone, setTone] = useState<ThemeTone>(initialTask?.tone || 'sky')
  const [priority, setPriority] = useState<PriorityTone>(initialTask?.priority || 'later')
  const [notes, setNotes] = useState(initialTask?.notes || '')
  const [meetingLink, setMeetingLink] = useState(initialTask?.meetingLink || '')
  const [meetingPassword, setMeetingPassword] = useState(initialTask?.meetingPassword || '')
  const [customColor, setCustomColor] = useState(initialTask?.customColor || '')
  const [recurringEnabled, setRecurringEnabled] = useState(initialTask?.recurring.enabled || false)
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(
    initialTask?.recurring.frequency || 'weekly',
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    const calculatedPriority = calculatePriorityFromDate(dueDate)

    const task: Omit<Task, 'id'> = {
      title: title.trim(),
      dueDate,
      dueTime: dueTime.trim() || undefined,
      project,
      status: initialTask?.status || initialStatus,
      tone,
      priority: calculatedPriority,
      notes,
      meetingLink: meetingLink.trim() || undefined,
      meetingPassword: meetingPassword.trim() || undefined,
      people: initialTask?.people || [],
      shareWith: initialTask?.shareWith || [],
      recurring: {
        enabled: recurringEnabled,
        frequency: recurringFrequency,
        nextReturnLabel: recurringEnabled
          ? recurringFrequency === 'weekly'
            ? 'Every week'
            : recurringFrequency === 'biweekly'
            ? 'Every 2 weeks'
            : 'Every month'
          : 'Not recurring',
        returnOnWeekday: recurringFrequency === 'weekly' || recurringFrequency === 'biweekly' ? 1 : undefined,
        returnOnMonthDay: recurringFrequency === 'monthly' ? 1 : undefined,
        lastCompletedWeek: undefined,
      },
      subtasks: initialTask?.subtasks || [],
      customColor: customColor.trim() || undefined,
    }

    onSave(task)
  }

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <form className="task-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
          <button type="button" className="close-button" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="form-body">
          <div className="form-field">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="dueTime">Time (Optional)</label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="project">Project</label>
            <input
              id="project"
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Project name"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="tone">Card Color Theme</label>
              <select id="tone" value={tone} onChange={(e) => setTone(e.target.value as ThemeTone)}>
                <option value="sky">Sky Blue</option>
                <option value="mint">Mint Green</option>
                <option value="pink">Pink</option>
                <option value="violet">Violet</option>
                <option value="peach">Peach</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="customColor">Custom Color (Optional)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="customColor"
                  type="color"
                  value={customColor || '#57A5FF'}
                  onChange={(e) => setCustomColor(e.target.value)}
                  style={{ width: '60px', height: '38px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#RRGGBB or leave empty"
                  style={{ flex: 1 }}
                />
              </div>
              {projects.length > 0 && (
                <div className="project-colors-list">
                  <span className="project-colors-label">Project Colors (click to use):</span>
                  <div className="project-colors-grid">
                    {projects.map((proj) => (
                      <div 
                        key={proj.id} 
                        className={`project-color-item ${customColor === proj.color ? 'selected' : ''}`}
                        title={`${proj.name} - Click to use this color`}
                        onClick={() => setCustomColor(proj.color)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div 
                          className="project-color-swatch" 
                          style={{ background: proj.color }}
                        >
                          {proj.icon && <img src={proj.icon} alt="" className="project-color-icon" />}
                        </div>
                        <span className="project-color-name">{proj.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="priority">Priority (Auto-calculated from deadline)</label>
            <div style={{ 
              padding: '10px 12px', 
              background: '#f5f5f5', 
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666'
            }}>
              {dueDate ? (
                <span>
                  Will be set to: <strong>{calculatePriorityFromDate(dueDate) === 'urgent' ? 'Urgent (Red)' : 
                    calculatePriorityFromDate(dueDate) === 'approaching' ? 'Deadline approaching (Orange)' :
                    calculatePriorityFromDate(dueDate) === 'active' ? 'Work on it (Yellow)' : 'Not needed right now (Green)'}</strong>
                </span>
              ) : (
                'Enter a due date to calculate priority'
              )}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add task notes..."
              rows={4}
            />
          </div>

          <div className="form-section-title">Meeting Details (Optional)</div>

          <div className="form-field">
            <label htmlFor="meetingLink">Meeting Link</label>
            <input
              id="meetingLink"
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            />
          </div>

          <div className="form-field">
            <label htmlFor="meetingPassword">Meeting Password</label>
            <input
              id="meetingPassword"
              type="text"
              value={meetingPassword}
              onChange={(e) => setMeetingPassword(e.target.value)}
              placeholder="Optional password for the meeting"
            />
          </div>

          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recurringEnabled}
                onChange={(e) => setRecurringEnabled(e.target.checked)}
              />
              <span>Recurring task</span>
            </label>
          </div>

          {recurringEnabled && (
            <div className="form-field">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as 'weekly' | 'biweekly' | 'monthly')}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly (Every 2 weeks)</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-footer">
          <button type="button" className="soft-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            {initialTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
