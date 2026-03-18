import { useEffect, useMemo, useState } from 'react'
import type { DragEvent, MouseEvent } from 'react'
import { TaskForm } from './TaskForm'
import { PersonForm } from './PersonForm'

type ColumnId = 'todo' | 'in-progress' | 'done'
type PriorityTone = 'urgent' | 'active' | 'approaching' | 'later'
type ThemeTone = 'sky' | 'mint' | 'pink' | 'violet' | 'peach'

type RecurringSchedule = {
  enabled: boolean
  frequency: 'weekly' | 'biweekly' | 'monthly'
  nextReturnLabel: string
  returnOnWeekday?: number
  returnOnMonthDay?: number
  lastCompletedWeek?: number
}

type Project = {
  id: string
  name: string
  color: string
  icon?: string
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
  dueTime?: string
  project: string
  status: ColumnId
  tone: ThemeTone
  priority: PriorityTone
  notes: string
  people: Person[]
  shareWith: string[]
  recurring: RecurringSchedule
  subtasks: Subtask[]
  completedAt?: string
  order?: number
  meetingLink?: string
  meetingPassword?: string
  customColor?: string
}

const columns: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

const initialTasks: Task[] = [
  {
    id: 'task-auth',
    title: 'Implement authentication system',
    dueDate: 'Mar 25, 2026',
    project: 'Backend API',
    status: 'todo',
    tone: 'sky',
    priority: 'approaching',
    notes: 'Set up JWT-based authentication with refresh tokens. Include social sign-in options.',
    people: [
      {
        id: 'person-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        slack: '@alex.rivera',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
      },
    ],
    shareWith: ['Product Team'],
    recurring: {
      enabled: false,
      frequency: 'weekly',
      nextReturnLabel: 'Returns when enabled',
      returnOnWeekday: 1,
    },
    subtasks: [
      { id: 'sub-auth-1', name: 'Setup JWT middleware', status: 'todo' },
      { id: 'sub-auth-2', name: 'Create login endpoint', status: 'todo' },
      { id: 'sub-auth-3', name: 'Add Google OAuth', status: 'in-progress' },
    ],
  },
  {
    id: 'task-research',
    title: 'User research interviews',
    dueDate: 'Apr 5, 2026',
    project: 'Project Expansion',
    status: 'todo',
    tone: 'mint',
    priority: 'later',
    notes: 'Interview five current users and document blockers, feature requests, and onboarding gaps.',
    people: [
      {
        id: 'person-2',
        name: 'Maya Chen',
        email: 'maya.chen@example.com',
        matrix: '@maya:matrix.org',
        location: 'Singapore',
        timezone: 'Asia/Singapore',
      },
      {
        id: 'person-3',
        name: 'Sam Osei',
        email: 'sam.osei@example.com',
        telegram: '@samosei',
        location: 'London, UK',
        timezone: 'Europe/London',
      },
    ],
    shareWith: ['UX Research'],
    recurring: {
      enabled: true,
      frequency: 'weekly',
      nextReturnLabel: 'Every Monday',
      returnOnWeekday: 1,
    },
    subtasks: [
      { id: 'sub-research-1', name: 'Prepare interview script', status: 'done' },
      { id: 'sub-research-2', name: 'Invite participants', status: 'in-progress' },
      { id: 'sub-research-3', name: 'Compile findings', status: 'todo' },
    ],
  },
  {
    id: 'task-design',
    title: 'Design landing page mockup',
    dueDate: 'Mar 20, 2026',
    project: 'Website Redesign',
    status: 'in-progress',
    tone: 'violet',
    priority: 'urgent',
    notes: 'Finalize hero section, features grid, and mobile layout before stakeholder review.',
    people: [
      {
        id: 'person-4',
        name: 'Nia Johnson',
        email: 'nia.johnson@example.com',
        slack: '@nia.johnson',
        location: 'New York, NY',
        timezone: 'America/New_York',
      },
    ],
    shareWith: ['Design Team'],
    recurring: {
      enabled: false,
      frequency: 'monthly',
      nextReturnLabel: 'Returns when enabled',
      returnOnMonthDay: 1,
    },
    subtasks: [
      { id: 'sub-design-1', name: 'Review content hierarchy', status: 'done' },
      { id: 'sub-design-2', name: 'Refine CTA block', status: 'in-progress' },
      { id: 'sub-design-3', name: 'Polish mobile spacing', status: 'todo' },
    ],
  },
  {
    id: 'task-meeting',
    title: 'Q1 marketing strategy meeting',
    dueDate: 'Mar 14, 2026',
    project: 'Marketing Campaign',
    status: 'in-progress',
    tone: 'pink',
    priority: 'urgent',
    notes: 'Recurring strategy sync with campaign stakeholders. Review channel performance and next experiments.',
    people: [
      {
        id: 'person-5',
        name: 'Ava Patel',
        email: 'ava.patel@example.com',
        slack: '@ava.patel',
        location: 'Mumbai, India',
        timezone: 'Asia/Kolkata',
      },
      {
        id: 'person-6',
        name: 'Noah Kim',
        email: 'noah.kim@example.com',
        matrix: '@noah:matrix.org',
        location: 'Seoul, South Korea',
        timezone: 'Asia/Seoul',
      },
      {
        id: 'person-7',
        name: 'Lina Brooks',
        email: 'lina.brooks@example.com',
        telegram: '@linabrooks',
        location: 'Sydney, Australia',
        timezone: 'Australia/Sydney',
      },
    ],
    shareWith: ['Marketing Leads'],
    recurring: {
      enabled: true,
      frequency: 'weekly',
      nextReturnLabel: 'Every Friday',
      returnOnWeekday: 5,
    },
    subtasks: [
      { id: 'sub-meeting-1', name: 'Prepare agenda', status: 'done' },
      { id: 'sub-meeting-2', name: 'Collect metrics', status: 'done' },
      { id: 'sub-meeting-3', name: 'Assign follow-ups', status: 'todo' },
    ],
  },
  {
    id: 'task-social',
    title: 'Social media content calendar',
    dueDate: 'Mar 22, 2026',
    project: 'Marketing Campaign',
    status: 'in-progress',
    tone: 'pink',
    priority: 'approaching',
    notes: 'Plan posts across Instagram, LinkedIn, and newsletter touchpoints for the upcoming launch cycle.',
    people: [
      {
        id: 'person-8',
        name: 'Jules Martin',
        email: 'jules.martin@example.com',
        slack: '@jules.martin',
        location: 'Paris, France',
        timezone: 'Europe/Paris',
      },
    ],
    shareWith: ['Content Team'],
    recurring: {
      enabled: true,
      frequency: 'monthly',
      nextReturnLabel: '1st business day monthly',
      returnOnMonthDay: 1,
    },
    subtasks: [
      { id: 'sub-social-1', name: 'Draft week 1 posts', status: 'todo' },
      { id: 'sub-social-2', name: 'Review brand alignment', status: 'in-progress' },
      { id: 'sub-social-3', name: 'Schedule approved posts', status: 'done' },
    ],
  },
  {
    id: 'task-bugs',
    title: 'Bug fixes for production',
    dueDate: 'Mar 19, 2026',
    project: 'Backend API',
    status: 'done',
    tone: 'sky',
    priority: 'active',
    notes: 'Fix critical bugs reported by QA, then verify deployment and monitor rollback readiness.',
    people: [
      {
        id: 'person-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        slack: '@alex.rivera',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
      },
      {
        id: 'person-4',
        name: 'Nia Johnson',
        email: 'nia.johnson@example.com',
        slack: '@nia.johnson',
        location: 'New York, NY',
        timezone: 'America/New_York',
      },
    ],
    shareWith: ['QA Team'],
    recurring: {
      enabled: true,
      frequency: 'weekly',
      nextReturnLabel: 'Every Thursday',
      returnOnWeekday: 4,
    },
    subtasks: [
      { id: 'sub-bugs-1', name: 'Fix login timeout', status: 'done' },
      { id: 'sub-bugs-2', name: 'Fix data export', status: 'done' },
      { id: 'sub-bugs-3', name: 'Update dependencies', status: 'done' },
    ],
  },
]

const toneStyles: Record<ThemeTone, { top: string; badge: string; soft: string }> = {
  sky: { top: '#57A5FF', badge: '#EAF3FF', soft: '#F7FAFF' },
  mint: { top: '#1ED760', badge: '#E9FFF1', soft: '#F8FFFA' },
  pink: { top: '#EF5DA8', badge: '#FFEAF5', soft: '#FFF8FC' },
  violet: { top: '#B76CFF', badge: '#F3EAFF', soft: '#FBF8FF' },
  peach: { top: '#FFAE70', badge: '#FFF1E6', soft: '#FFFBF7' },
}

const priorityLabels: Record<PriorityTone, string> = {
  urgent: 'Urgent',
  active: 'Work on it',
  approaching: 'Deadline approaching',
  later: 'Not needed right now',
}

const priorityColors: Record<PriorityTone, string> = {
  urgent: '#FF5A5F',
  active: '#FFD84D',
  approaching: '#FF9F43',
  later: '#47C97E',
}

const columnSurface: Record<ColumnId, string> = {
  todo: 'rgba(255, 255, 255, 0.88)',
  'in-progress': 'rgba(255, 255, 255, 0.88)',
  done: 'rgba(255, 255, 255, 0.88)',
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function shouldReturnRecurringTask(schedule: RecurringSchedule, currentDate: Date) {
  if (!schedule.enabled) {
    return false
  }

  if (schedule.frequency === 'weekly') {
    return schedule.returnOnWeekday === currentDate.getDay()
  }

  if (schedule.frequency === 'biweekly') {
    const currentWeek = getWeekNumber(currentDate)
    const isCorrectDay = schedule.returnOnWeekday === currentDate.getDay()
    const isCorrectWeek = schedule.lastCompletedWeek !== undefined
      ? currentWeek !== schedule.lastCompletedWeek && (currentWeek - schedule.lastCompletedWeek) % 2 === 0
      : currentWeek % 2 === 0
    return isCorrectDay && isCorrectWeek
  }

  return schedule.returnOnMonthDay === currentDate.getDate()
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [archivedTasks, setArchivedTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('kanban-archived-tasks')
    return stored ? JSON.parse(stored) : []
  })
  const [contacts, setContacts] = useState<Person[]>(() => {
    const stored = localStorage.getItem('kanban-contacts')
    if (stored) {
      return JSON.parse(stored)
    }
    const initialContacts: Person[] = []
    initialTasks.forEach((task) => {
      task.people.forEach((person) => {
        if (!initialContacts.find((c) => c.id === person.id)) {
          initialContacts.push(person)
        }
      })
    })
    localStorage.setItem('kanban-contacts', JSON.stringify(initialContacts))
    return initialContacts
  })
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('kanban-projects')
    if (stored) {
      return JSON.parse(stored)
    }
    const initialProjects: Project[] = []
    initialTasks.forEach((task) => {
      if (task.project && !initialProjects.find((p) => p.name === task.project)) {
        const tone = toneStyles[task.tone]
        initialProjects.push({
          id: `project-${Date.now()}-${Math.random()}`,
          name: task.project,
          color: tone.top,
        })
      }
    })
    localStorage.setItem('kanban-projects', JSON.stringify(initialProjects))
    return initialProjects
  })
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingNotesTaskId, setEditingNotesTaskId] = useState<string | null>(null)
  const [editedNotes, setEditedNotes] = useState('')
  const [showCreateForm, setShowCreateForm] = useState<{ column: ColumnId } | null>(null)
  const [showContactPicker, setShowContactPicker] = useState<{ taskId: string } | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const [showProjectManager, setShowProjectManager] = useState(false)
  const [showPersonForm, setShowPersonForm] = useState<{ taskId: string } | null>(null)
  const [promotingSubtask, setPromotingSubtask] = useState<{ parentTask: Task; subtaskName: string; subtaskStatus: ColumnId } | null>(null)
  const [todayTick, setTodayTick] = useState(() => new Date().toDateString())
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('kanban-dark-mode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTodayTick(new Date().toDateString())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('kanban-dark-mode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [darkMode])

  useEffect(() => {
    const currentDate = new Date()
    const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    setTasks((currentTasks: Task[]) => {
      const tasksToArchive: Task[] = []
      const remainingTasks: Task[] = []

      currentTasks.forEach((task: Task) => {
        if (
          task.status === 'done' &&
          task.completedAt &&
          !task.recurring.enabled &&
          new Date(task.completedAt) < sevenDaysAgo
        ) {
          tasksToArchive.push(task)
        } else if (task.status === 'done' && shouldReturnRecurringTask(task.recurring, currentDate)) {
          remainingTasks.push({ ...task, status: 'todo', completedAt: undefined })
        } else {
          remainingTasks.push(task)
        }
      })

      if (tasksToArchive.length > 0) {
        setArchivedTasks((current) => {
          const updated = [...current, ...tasksToArchive]
          localStorage.setItem('kanban-archived-tasks', JSON.stringify(updated))
          return updated
        })
      }

      return remainingTasks
    })
  }, [todayTick])

  const tasksByColumn = useMemo(() => {
    return columns.reduce<Record<ColumnId, Task[]>>((accumulator, column) => {
      accumulator[column.id] = tasks
        .filter((task) => task.status === column.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      return accumulator
    }, { todo: [], 'in-progress': [], done: [] })
  }, [tasks])

  const activeTask = tasks.find((task) => task.id === activeTaskId) ?? null

  const moveTask = (taskId: string, nextStatus: ColumnId, insertBeforeTaskId?: string) => {
    setTasks((currentTasks: Task[]) => {
      const task = currentTasks.find((t) => t.id === taskId)
      if (!task) return currentTasks

      const targetColumnTasks = currentTasks
        .filter((t) => t.status === nextStatus && t.id !== taskId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      let newOrder: number
      if (insertBeforeTaskId) {
        const insertIndex = targetColumnTasks.findIndex((t) => t.id === insertBeforeTaskId)
        if (insertIndex === 0) {
          newOrder = (targetColumnTasks[0]?.order ?? 0) - 1
        } else if (insertIndex > 0) {
          const prevOrder = targetColumnTasks[insertIndex - 1]?.order ?? 0
          const nextOrder = targetColumnTasks[insertIndex]?.order ?? prevOrder + 2
          newOrder = (prevOrder + nextOrder) / 2
        } else {
          newOrder = (targetColumnTasks[targetColumnTasks.length - 1]?.order ?? 0) + 1
        }
      } else {
        newOrder = (targetColumnTasks[targetColumnTasks.length - 1]?.order ?? 0) + 1
      }

      return currentTasks.map((t: Task) => {
        if (t.id !== taskId) return t

        const updates: Partial<Task> = { 
          status: nextStatus,
          order: newOrder,
        }
        
        if (nextStatus === 'done' && task.status !== 'done') {
          updates.completedAt = new Date().toISOString()
        } else if (nextStatus !== 'done' && task.status === 'done') {
          updates.completedAt = undefined
        }

        return { ...t, ...updates }
      })
    })
  }

  const moveSubtask = (taskId: string, subtaskId: string, nextStatus: ColumnId) => {
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) => {
        if (task.id !== taskId) {
          return task
        }

        return {
          ...task,
          subtasks: task.subtasks.map((subtask: Subtask) =>
            subtask.id === subtaskId ? { ...subtask, status: nextStatus } : subtask,
          ),
        }
      }),
    )
  }

  const toggleRecurring = (taskId: string) => {
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) =>
        task.id === taskId
          ? {
              ...task,
              recurring: {
                ...task.recurring,
                enabled: !task.recurring.enabled,
              },
            }
          : task,
      ),
    )
  }

  const restoreRecurringTask = (taskId: string) => {
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) =>
        task.id === taskId && task.recurring.enabled && task.status === 'done'
          ? { ...task, status: 'todo' }
          : task,
      ),
    )
  }

  const reorderTasksByPriority = (tasks: Task[]): Task[] => {
    const tasksByColumn: Record<string, Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': []
    }

    tasks.forEach(task => {
      if (!tasksByColumn[task.status]) {
        tasksByColumn[task.status] = []
      }
      tasksByColumn[task.status].push(task)
    })

    Object.keys(tasksByColumn).forEach(columnId => {
      tasksByColumn[columnId].sort((a, b) => {
        const priorityOrder = { 'urgent': 0, 'approaching': 1, 'active': 2, 'later': 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    })

    return Object.values(tasksByColumn).flat()
  }

  const createTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    }
    setTasks((currentTasks: Task[]) => {
      const updatedTasks = [...currentTasks, task]
      if (task.priority === 'approaching' || task.priority === 'urgent') {
        return reorderTasksByPriority(updatedTasks)
      }
      return updatedTasks
    })
    setShowCreateForm(null)
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((currentTasks: Task[]) => {
      const oldTask = currentTasks.find(t => t.id === taskId)
      const updatedTasks = currentTasks.map((task: Task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      )
      
      const newTask = updatedTasks.find(t => t.id === taskId)
      if (newTask && oldTask) {
        const priorityChanged = oldTask.priority !== newTask.priority
        const becameApproachingOrUrgent = 
          (newTask.priority === 'approaching' || newTask.priority === 'urgent') &&
          (oldTask.priority !== 'approaching' && oldTask.priority !== 'urgent')
        
        if (priorityChanged && becameApproachingOrUrgent) {
          return reorderTasksByPriority(updatedTasks)
        }
      }
      
      return updatedTasks
    })
    setEditingTaskId(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks: Task[]) => currentTasks.filter((task: Task) => task.id !== taskId))
    setActiveTaskId(null)
  }

  const addSubtask = (taskId: string, subtaskName: string) => {
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) => {
        if (task.id !== taskId) {
          return task
        }
        return {
          ...task,
          subtasks: [
            ...task.subtasks,
            { id: `sub-${Date.now()}`, name: subtaskName, status: 'todo' },
          ],
        }
      }),
    )
  }

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) => {
        if (task.id !== taskId) {
          return task
        }
        return {
          ...task,
          subtasks: task.subtasks.filter((sub: Subtask) => sub.id !== subtaskId),
        }
      }),
    )
  }

  const promoteSubtaskToTask = (taskId: string, subtaskId: string) => {
    const parentTask = tasks.find((t) => t.id === taskId)
    if (!parentTask) return

    const subtask = parentTask.subtasks.find((s: Subtask) => s.id === subtaskId)
    if (!subtask) return

    setPromotingSubtask({
      parentTask,
      subtaskName: subtask.name,
      subtaskStatus: subtask.status,
    })

    deleteSubtask(taskId, subtaskId)
  }

  const saveContact = (person: Person) => {
    setContacts((current) => {
      const existingIndex = current.findIndex((c) => c.id === person.id)
      let updated: Person[]
      if (existingIndex >= 0) {
        updated = [...current]
        updated[existingIndex] = person
      } else {
        updated = [...current, person]
      }
      localStorage.setItem('kanban-contacts', JSON.stringify(updated))
      return updated
    })
  }

  const deleteContact = (personId: string) => {
    setContacts((current) => {
      const updated = current.filter((c) => c.id !== personId)
      localStorage.setItem('kanban-contacts', JSON.stringify(updated))
      return updated
    })
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) => ({
        ...task,
        people: task.people.filter((p: Person) => p.id !== personId),
      })),
    )
  }

  const saveProject = (project: Project) => {
    setProjects((current) => {
      const existingIndex = current.findIndex((p) => p.id === project.id)
      let updated: Project[]
      if (existingIndex >= 0) {
        updated = [...current]
        updated[existingIndex] = project
      } else {
        updated = [...current, project]
      }
      localStorage.setItem('kanban-projects', JSON.stringify(updated))
      return updated
    })
  }

  const deleteProject = (projectId: string) => {
    setProjects((current) => {
      const updated = current.filter((p) => p.id !== projectId)
      localStorage.setItem('kanban-projects', JSON.stringify(updated))
      return updated
    })
  }

  const getProjectColor = (projectName: string): string => {
    const project = projects.find((p) => p.name === projectName)
    return project?.color || '#a5b4fc'
  }

  const addPersonToTask = (taskId: string, personId: string) => {
    const contact = contacts.find((c) => c.id === personId)
    if (!contact) return

    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) => {
        if (task.id !== taskId) {
          return task
        }
        if (task.people.find((p) => p.id === personId)) {
          return task
        }
        return {
          ...task,
          people: [...task.people, contact],
        }
      }),
    )
  }

  const removePersonFromTask = (taskId: string, personId: string) => {
    setTasks((currentTasks: Task[]) =>
      currentTasks.map((task: Task) => {
        if (task.id !== taskId) {
          return task
        }
        return {
          ...task,
          people: task.people.filter((p: Person) => p.id !== personId),
        }
      }),
    )
  }

  const restoreFromArchive = (taskId: string) => {
    const taskToRestore = archivedTasks.find((t) => t.id === taskId)
    if (!taskToRestore) return

    setTasks((current) => [...current, { ...taskToRestore, status: 'todo', completedAt: undefined }])
    setArchivedTasks((current) => {
      const updated = current.filter((t) => t.id !== taskId)
      localStorage.setItem('kanban-archived-tasks', JSON.stringify(updated))
      return updated
    })
    setShowArchive(false)
  }

  const deleteArchivedTask = (taskId: string) => {
    setArchivedTasks((current) => {
      const updated = current.filter((t) => t.id !== taskId)
      localStorage.setItem('kanban-archived-tasks', JSON.stringify(updated))
      return updated
    })
  }

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxSize = 32
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL('image/png'))
          } else {
            reject(new Error('Could not get canvas context'))
          }
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Personal kanban</p>
          <h1>Kanban Board</h1>
          <p className="hero-copy">
            Organize tasks with soft pastel cards, drag interactions, recurring meetings, and detailed notes.
          </p>
        </div>
        <div className="hero-pills">
          <span>Drag and drop</span>
          <span>Recurring cards</span>
          <span>Mini subtask kanban</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowProjectManager(true)}
            title="Manage projects"
          >
            🎨
          </button>
          <button type="button" className="icon-button" onClick={() => setShowArchive(true)} title="View archive">
            📦
          </button>
          <button type="button" className="icon-button" onClick={() => setShowPersonForm({ taskId: '' })} title="Add person">
            +
          </button>
        </div>
      </header>

      <div className="board-container">
        {columns.map((column) => (
          <section
            key={column.id}
            className="board-column"
            onDragOver={(event: DragEvent<HTMLElement>) => event.preventDefault()}
            onDrop={() => {
              if (draggedTaskId) {
                moveTask(draggedTaskId, column.id)
                setDraggedTaskId(null)
              }
            }}
          >
            <div className="column-header">
              <div>
                <h2>{column.title}</h2>
                <p>{tasksByColumn[column.id].length} tasks</p>
              </div>
              <button
                type="button"
                className="add-task-button"
                onClick={() => setShowCreateForm({ column: column.id })}
                title="Add task"
              >
                + Add
              </button>
            </div>

            <div className="column-stack">
              {tasksByColumn[column.id].map((task) => {
                const cardColor = task.customColor || (task.project ? getProjectColor(task.project) : toneStyles[task.tone].top)
                const projectData = task.project ? projects.find((p) => p.name === task.project) : null
                const projectIcon = projectData?.icon
                const isDragging = draggedTaskId === task.id
                const isDragOver = dragOverTaskId === task.id
                return (
                  <article
                    key={task.id}
                    className={`task-card ${isDragging ? 'dragging' : ''} ${isDragOver && dragPosition === 'before' ? 'drag-over-before' : ''} ${isDragOver && dragPosition === 'after' ? 'drag-over-after' : ''}`}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDragEnd={() => {
                      setDraggedTaskId(null)
                      setDragOverTaskId(null)
                      setDragPosition(null)
                    }}
                    onDragOver={(event: DragEvent<HTMLElement>) => {
                      event.preventDefault()
                      if (draggedTaskId && draggedTaskId !== task.id) {
                        const rect = event.currentTarget.getBoundingClientRect()
                        const midpoint = rect.top + rect.height / 2
                        const position = event.clientY < midpoint ? 'before' : 'after'
                        setDragOverTaskId(task.id)
                        setDragPosition(position)
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverTaskId === task.id) {
                        setDragOverTaskId(null)
                        setDragPosition(null)
                      }
                    }}
                    onDrop={(event: DragEvent<HTMLElement>) => {
                      event.stopPropagation()
                      if (draggedTaskId && draggedTaskId !== task.id) {
                        const draggedTask = tasks.find((t) => t.id === draggedTaskId)
                        if (draggedTask) {
                          if (dragPosition === 'before') {
                            moveTask(draggedTaskId, column.id, task.id)
                          } else {
                            const taskIndex = tasksByColumn[column.id].findIndex(t => t.id === task.id)
                            const nextTask = tasksByColumn[column.id][taskIndex + 1]
                            if (nextTask) {
                              moveTask(draggedTaskId, column.id, nextTask.id)
                            } else {
                              moveTask(draggedTaskId, column.id)
                            }
                          }
                        }
                      }
                      setDragOverTaskId(null)
                      setDragPosition(null)
                    }}
                    onClick={() => setActiveTaskId(task.id)}
                  >
                    <div className="task-card-top" style={{ background: cardColor }}>
                      {projectIcon && <img src={projectIcon} alt="icon" className="task-card-icon" />}
                      <span>{task.title}</span>
                    </div>
                    <div className="task-card-body">
                      <div className="task-meta-row">
                        <span className="meta-item">🗓 {task.dueDate}{task.dueTime ? ` at ${task.dueTime}` : ''}</span>
                      </div>
                      <div className="task-meta-row">
                        <span className="meta-item">📁 {task.project}</span>
                      </div>
                      <div className="task-card-footer">
                        <div className="avatar-row">
                          {task.people.slice(0, 3).map((person: Person) => (
                            <span key={person.id} className="avatar-chip" title={person.name}>
                              {person.name
                                .split(' ')
                                .map((part: string) => part[0])
                                .join('')}
                            </span>
                          ))}
                        </div>
                        {task.recurring.enabled ? <span className="recurring-pill">↺ {task.recurring.frequency}</span> : null}
                      </div>
                    </div>
                    <div className="task-priority-line" style={{ background: priorityColors[task.priority] }} />
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {activeTask ? (
        <div className="modal-backdrop" onClick={() => setActiveTaskId(null)}>
          <section className="task-modal" onClick={(event: DragEvent<HTMLElement> | MouseEvent<HTMLElement>) => event.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h3>{activeTask.title}</h3>
                <span
                  className="priority-chip"
                  style={{
                    background: toneStyles[activeTask.tone].badge,
                    color: priorityColors[activeTask.priority],
                  }}
                >
                  {priorityLabels[activeTask.priority]}
                </span>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => {
                    setEditingTaskId(activeTask.id)
                  }}
                  title="Edit task"
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="icon-button delete-button"
                  onClick={() => {
                    if (window.confirm('Delete this task?')) {
                      deleteTask(activeTask.id)
                    }
                  }}
                  title="Delete task"
                >
                  🗑
                </button>
                <button type="button" className="close-button" onClick={() => setActiveTaskId(null)}>
                  ×
                </button>
              </div>
            </div>

            <div className="modal-details-grid">
              <div className="detail-card detail-soft-blue">
                <span className="detail-label">Due date</span>
                <strong>{activeTask.dueDate}{activeTask.dueTime ? ` at ${activeTask.dueTime}` : ''}</strong>
              </div>
              <div className="detail-card detail-soft-purple">
                <span className="detail-label">Project</span>
                <strong>{activeTask.project}</strong>
              </div>
            </div>

            <div className="detail-card detail-soft-yellow notes-card">
              <span className="detail-label">Notes</span>
              {editingNotesTaskId === activeTask.id ? (
                <div>
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                    autoFocus
                  />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => {
                        updateTask(activeTask.id, { notes: editedNotes })
                        setEditingNotesTaskId(null)
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="soft-button"
                      onClick={() => setEditingNotesTaskId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  onClick={() => {
                    setEditingNotesTaskId(activeTask.id)
                    setEditedNotes(activeTask.notes)
                  }}
                  style={{ cursor: 'pointer', minHeight: '40px' }}
                  title="Click to edit notes"
                >
                  {activeTask.notes || 'Click to add notes...'}
                </p>
              )}
            </div>

            {(activeTask.meetingLink || activeTask.meetingPassword) && (
              <div className="detail-card detail-soft-blue meeting-card">
                <span className="detail-label">Meeting Details</span>
                {activeTask.meetingLink && (
                  <div className="meeting-item">
                    <div className="meeting-info">
                      <strong>🔗 Meeting Link</strong>
                      <a href={activeTask.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                        {activeTask.meetingLink}
                      </a>
                    </div>
                    <button
                      type="button"
                      className="copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeTask.meetingLink!)
                        alert('Meeting link copied to clipboard!')
                      }}
                      title="Copy link"
                    >
                      📋 Copy
                    </button>
                  </div>
                )}
                {activeTask.meetingPassword && (
                  <div className="meeting-item">
                    <div className="meeting-info">
                      <strong>🔐 Password</strong>
                      <code className="meeting-password">{activeTask.meetingPassword}</code>
                    </div>
                    <button
                      type="button"
                      className="copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeTask.meetingPassword!)
                        alert('Password copied to clipboard!')
                      }}
                      title="Copy password"
                    >
                      📋 Copy
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="detail-card detail-soft-indigo people-card">
              <span className="detail-label">Assigned People</span>
              <div className="people-list">
                {activeTask.people.map((person: Person) => (
                  <div key={person.id} className="person-detail-card">
                    <div className="person-header">
                      <div className="person-avatar">
                        {person.name
                          .split(' ')
                          .map((part: string) => part[0])
                          .join('')}
                      </div>
                      <div className="person-info">
                        <strong>{person.name}</strong>
                        {person.email && <span className="person-contact">✉ {person.email}</span>}
                      </div>
                      <button
                        type="button"
                        className="remove-person-btn-card"
                        onClick={() => removePersonFromTask(activeTask.id, person.id)}
                        title="Remove person"
                      >
                        ×
                      </button>
                    </div>
                    {(person.slack || person.matrix || person.telegram || person.location || person.timezone) && (
                      <div className="person-details">
                        {person.slack && <span className="contact-badge">💬 Slack: {person.slack}</span>}
                        {person.matrix && <span className="contact-badge">🔷 Matrix: {person.matrix}</span>}
                        {person.telegram && <span className="contact-badge">✈️ Telegram: {person.telegram}</span>}
                        {person.location && <span className="contact-badge">📍 {person.location}</span>}
                        {person.timezone && (
                          <span className="contact-badge timezone-badge">
                            🕐 {new Date().toLocaleTimeString('en-US', {
                              timeZone: person.timezone,
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-person-btn"
                  onClick={() => setShowContactPicker({ taskId: activeTask.id })}
                >
                  + Add Person
                </button>
              </div>
              <div className="people-wrap secondary">
                {activeTask.shareWith.map((group: string) => (
                  <span key={group} className="share-link">↗ Share with {group}</span>
                ))}
              </div>
            </div>

            <div className="detail-card recurring-card">
              <div>
                <span className="detail-label">Recurring option</span>
                <strong>{activeTask.recurring.enabled ? activeTask.recurring.nextReturnLabel : 'One-time task'}</strong>
              </div>
              <div className="recurring-actions">
                <button type="button" className="soft-button" onClick={() => toggleRecurring(activeTask.id)}>
                  {activeTask.recurring.enabled ? 'Disable recurring' : 'Enable recurring'}
                </button>
                {activeTask.recurring.enabled && activeTask.status === 'done' ? (
                  <button type="button" className="primary-button" onClick={() => restoreRecurringTask(activeTask.id)}>
                    Return to To Do
                  </button>
                ) : null}
              </div>
            </div>

            <div className="subtask-section">
              <div className="subtask-header">
                <h4>Subtasks</h4>
                <div>
                  <button
                    type="button"
                    className="add-subtask-btn"
                    onClick={() => {
                      const name = window.prompt('Enter subtask name:')
                      if (name?.trim()) {
                        addSubtask(activeTask.id, name.trim())
                      }
                    }}
                  >
                    + Add Subtask
                  </button>
                  <span className="mini-badge">Drag mini cards</span>
                </div>
              </div>
              <div className="subtask-grid">
                {columns.map((column) => (
                  <div
                    key={`${activeTask.id}-${column.id}`}
                    className="subtask-column"
                    onDragOver={(event: DragEvent<HTMLDivElement>) => event.preventDefault()}
                    onDrop={(event: DragEvent<HTMLDivElement>) => {
                      const subtaskId = event.dataTransfer.getData('text/subtask-id')
                      if (subtaskId) {
                        moveSubtask(activeTask.id, subtaskId, column.id)
                      }
                    }}
                  >
                    <h5>{column.title}</h5>
                    <div className="subtask-stack">
                      {activeTask.subtasks
                        .filter((subtask: Subtask) => subtask.status === column.id)
                        .map((subtask: Subtask) => (
                          <div
                            key={subtask.id}
                            className="subtask-card"
                            draggable
                            onDragStart={(event: DragEvent<HTMLDivElement>) => {
                              event.dataTransfer.setData('text/subtask-id', subtask.id)
                            }}
                          >
                            <span>{subtask.name}</span>
                            <div className="subtask-actions">
                              <button
                                type="button"
                                className="promote-subtask-btn"
                                onClick={() => promoteSubtaskToTask(activeTask.id, subtask.id)}
                                title="Promote to full task"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="delete-subtask-btn"
                                onClick={() => deleteSubtask(activeTask.id, subtask.id)}
                                title="Delete subtask"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {showCreateForm ? (
        <TaskForm
          initialStatus={showCreateForm.column}
          onSave={createTask}
          onCancel={() => setShowCreateForm(null)}
          projects={projects}
        />
      ) : null}

      {editingTaskId ? (
        <TaskForm
          initialTask={tasks.find((t) => t.id === editingTaskId)}
          initialStatus="todo"
          onSave={(updatedTask) => updateTask(editingTaskId, updatedTask)}
          onCancel={() => setEditingTaskId(null)}
          projects={projects}
        />
      ) : null}

      {promotingSubtask ? (
        <TaskForm
          initialTask={{
            id: '',
            title: promotingSubtask.subtaskName,
            dueDate: promotingSubtask.parentTask.dueDate,
            dueTime: promotingSubtask.parentTask.dueTime,
            project: promotingSubtask.parentTask.project,
            status: promotingSubtask.subtaskStatus,
            tone: promotingSubtask.parentTask.tone,
            priority: promotingSubtask.parentTask.priority,
            notes: '',
            people: [],
            shareWith: [],
            recurring: {
              enabled: false,
              frequency: 'weekly',
              nextReturnLabel: 'Not recurring',
            },
            subtasks: [],
            customColor: promotingSubtask.parentTask.customColor,
          }}
          initialStatus={promotingSubtask.subtaskStatus}
          onSave={(newTask) => {
            createTask(newTask)
            setPromotingSubtask(null)
          }}
          onCancel={() => setPromotingSubtask(null)}
          projects={projects}
        />
      ) : null}

      {showPersonForm ? (
        <PersonForm
          onSave={(person) => {
            saveContact(person)
            if (showPersonForm.taskId) {
              addPersonToTask(showPersonForm.taskId, person.id)
            }
            setShowPersonForm(null)
          }}
          onCancel={() => setShowPersonForm(null)}
        />
      ) : null}

      {showProjectManager ? (
        <div className="modal-backdrop" onClick={() => setShowProjectManager(false)}>
          <section className="project-manager-modal" onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h3>🎨 Project Manager</h3>
                <p className="archive-subtitle">
                  Manage your projects and assign custom colors
                </p>
              </div>
              <button type="button" className="close-button" onClick={() => setShowProjectManager(false)}>
                ×
              </button>
            </div>

            <div className="project-manager-content">
              <div className="project-form-inline">
                <input
                  type="text"
                  placeholder="New project name..."
                  className="project-name-input"
                  id="new-project-name"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="project-icon-upload"
                  id="new-project-icon"
                  title="Upload icon image"
                />
                <input
                  type="color"
                  defaultValue="#a5b4fc"
                  className="project-color-input"
                  id="new-project-color"
                  title="Choose project color"
                />
                <button
                  type="button"
                  className="primary-button"
                  onClick={async () => {
                    const nameInput = document.getElementById('new-project-name') as HTMLInputElement
                    const iconInput = document.getElementById('new-project-icon') as HTMLInputElement
                    const colorInput = document.getElementById('new-project-color') as HTMLInputElement
                    const name = nameInput.value.trim()
                    const color = colorInput.value
                    
                    let icon: string | undefined
                    if (iconInput.files && iconInput.files[0]) {
                      try {
                        icon = await resizeImage(iconInput.files[0])
                      } catch (error) {
                        console.error('Failed to process icon:', error)
                      }
                    }
                    
                    if (name) {
                      saveProject({
                        id: `project-${Date.now()}`,
                        name,
                        color,
                        icon,
                      })
                      nameInput.value = ''
                      iconInput.value = ''
                      colorInput.value = '#a5b4fc'
                    }
                  }}
                >
                  + Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="empty-projects">
                  <p>No projects yet</p>
                  <span>Create your first project to organize your tasks</span>
                </div>
              ) : (
                <div className="project-list">
                  {projects.map((project: Project) => {
                    const taskCount = tasks.filter((t) => t.project === project.name).length
                    return (
                      <div key={project.id} className="project-item">
                        <div
                          className="project-color-preview"
                          style={{ background: project.color }}
                        >
                          {project.icon && <img src={project.icon} alt="icon" className="project-icon-preview" />}
                        </div>
                        <div className="project-item-info">
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              const newName = e.target.value
                              if (newName.trim()) {
                                saveProject({
                                  ...project,
                                  name: newName,
                                })
                              }
                            }}
                            className="project-name-edit"
                            title="Edit project name"
                          />
                          <span className="project-task-count">{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="project-item-actions">
                          <label className="project-icon-upload-label" title="Change icon">
                            {project.icon ? (
                              <img src={project.icon} alt="icon" className="project-icon-thumb" />
                            ) : (
                              <span className="project-icon-placeholder">📷</span>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="project-icon-upload-hidden"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  try {
                                    const icon = await resizeImage(e.target.files[0])
                                    saveProject({
                                      ...project,
                                      icon,
                                    })
                                  } catch (error) {
                                    console.error('Failed to process icon:', error)
                                  }
                                }
                              }}
                            />
                          </label>
                          <input
                            type="color"
                            value={project.color}
                            onChange={(e) => {
                              saveProject({
                                ...project,
                                color: e.target.value,
                              })
                            }}
                            className="project-color-input-small"
                            title="Change color"
                          />
                          <button
                            type="button"
                            className="icon-button delete-button"
                            onClick={() => {
                              if (window.confirm(`Delete project "${project.name}"? Tasks will not be deleted.`)) {
                                deleteProject(project.id)
                              }
                            }}
                            title="Delete project"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {showContactPicker ? (
        <div className="modal-backdrop" onClick={() => setShowContactPicker(null)}>
          <section className="contact-picker-modal" onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h3>👥 Add Person to Task</h3>
                <p className="archive-subtitle">
                  Select from existing contacts or create a new one
                </p>
              </div>
              <button type="button" className="close-button" onClick={() => setShowContactPicker(null)}>
                ×
              </button>
            </div>

            <div className="contact-picker-content">
              <button
                type="button"
                className="create-contact-btn"
                onClick={() => {
                  setShowPersonForm({ taskId: showContactPicker.taskId })
                  setShowContactPicker(null)
                }}
              >
                + Create New Contact
              </button>

              {contacts.length === 0 ? (
                <div className="empty-contacts">
                  <p>No contacts yet</p>
                  <span>Create your first contact to get started</span>
                </div>
              ) : (
                <div className="contact-list">
                  {contacts.map((contact: Person) => {
                    const task = tasks.find((t) => t.id === showContactPicker.taskId)
                    const isAlreadyAdded = task?.people.find((p) => p.id === contact.id)
                    return (
                      <div key={contact.id} className="contact-picker-card">
                        <div className="contact-picker-header">
                          <div className="person-avatar">
                            {contact.name
                              .split(' ')
                              .map((part: string) => part[0])
                              .join('')}
                          </div>
                          <div className="contact-picker-info">
                            <strong>{contact.name}</strong>
                            {contact.email && <span className="person-contact">✉ {contact.email}</span>}
                            {contact.location && <span className="person-contact">📍 {contact.location}</span>}
                          </div>
                          <div className="contact-picker-actions">
                            {isAlreadyAdded ? (
                              <span className="already-added-badge">✓ Added</span>
                            ) : (
                              <button
                                type="button"
                                className="primary-button"
                                onClick={() => {
                                  addPersonToTask(showContactPicker.taskId, contact.id)
                                  setShowContactPicker(null)
                                }}
                              >
                                Add
                              </button>
                            )}
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => {
                                setShowPersonForm({ taskId: '' })
                                setShowContactPicker(null)
                              }}
                              title="Edit contact"
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="icon-button delete-button"
                              onClick={() => {
                                if (window.confirm(`Delete ${contact.name} from contacts?`)) {
                                  deleteContact(contact.id)
                                }
                              }}
                              title="Delete contact"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {showArchive ? (
        <div className="modal-backdrop" onClick={() => setShowArchive(false)}>
          <section className="archive-modal" onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <h3>📦 Archived Tasks</h3>
                <p className="archive-subtitle">
                  Tasks completed over 7 days ago are automatically archived here
                </p>
              </div>
              <button type="button" className="close-button" onClick={() => setShowArchive(false)}>
                ×
              </button>
            </div>

            <div className="archive-content">
              {archivedTasks.length === 0 ? (
                <div className="empty-archive">
                  <p>No archived tasks yet</p>
                  <span>Tasks will appear here 7 days after completion</span>
                </div>
              ) : (
                <div className="archive-list">
                  {archivedTasks.map((task: Task) => {
                    const tone = toneStyles[task.tone]
                    const completedDate = task.completedAt
                      ? new Date(task.completedAt).toLocaleDateString()
                      : 'Unknown'
                    return (
                      <article key={task.id} className="archive-card">
                        <div className="archive-card-header" style={{ borderLeftColor: tone.top }}>
                          <div>
                            <h4>{task.title}</h4>
                            <p className="archive-meta">
                              Completed: {completedDate} • Project: {task.project || 'None'}
                            </p>
                          </div>
                          <div className="archive-actions">
                            <button
                              type="button"
                              className="soft-button"
                              onClick={() => restoreFromArchive(task.id)}
                              title="Restore to board"
                            >
                              ↺ Restore
                            </button>
                            <button
                              type="button"
                              className="icon-button delete-button"
                              onClick={() => {
                                if (window.confirm('Permanently delete this archived task?')) {
                                  deleteArchivedTask(task.id)
                                }
                              }}
                              title="Delete permanently"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                        {task.notes && (
                          <div className="archive-notes">
                            <strong>Notes:</strong> {task.notes}
                          </div>
                        )}
                        {task.people.length > 0 && (
                          <div className="archive-people">
                            <strong>People:</strong> {task.people.join(', ')}
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default App
