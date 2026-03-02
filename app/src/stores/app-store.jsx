/**
 * Global app state — React context + useReducer.
 * Manages: user profile, active system, tier, evaluations, credits, preferences.
 */

import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'libernumerus_state'

const defaultState = {
  // User
  user: {
    name: '',
    birthDate: null,
    tier: 'basic', // 'basic' | 'premium'
    credits: 0,
  },

  // Active system (Basic mode)
  activeSystem: 'pythagorean',
  systemPresets: {},

  // Evaluations
  evaluations: [],
  starredIds: new Set(),

  // Snapshots (Premium)
  snapshots: [],

  // UI state
  activeTab: 'portal',
  inputMode: 'name', // 'name' | 'date' | 'number' | 'divine'
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    parsed.starredIds = new Set(parsed.starredIds || [])
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function saveState(state) {
  try {
    const toSave = {
      ...state,
      starredIds: Array.from(state.starredIds),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch { /* quota exceeded — fail silently */ }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab }

    case 'SET_INPUT_MODE':
      return { ...state, inputMode: action.mode }

    case 'SET_ACTIVE_SYSTEM':
      return { ...state, activeSystem: action.systemId }

    case 'SET_SYSTEM_PRESET':
      return {
        ...state,
        systemPresets: {
          ...state.systemPresets,
          [action.systemId]: action.preset,
        },
      }

    case 'SET_TIER':
      return {
        ...state,
        user: { ...state.user, tier: action.tier },
      }

    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.data },
      }

    case 'ADD_EVALUATION': {
      const evaluation = {
        ...action.evaluation,
        id: `eval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        starred: false,
      }
      return {
        ...state,
        evaluations: [evaluation, ...state.evaluations],
      }
    }

    case 'TOGGLE_STAR': {
      const newStarred = new Set(state.starredIds)
      if (newStarred.has(action.id)) {
        newStarred.delete(action.id)
      } else {
        newStarred.add(action.id)
      }
      return { ...state, starredIds: newStarred }
    }

    case 'ADD_SNAPSHOT':
      return {
        ...state,
        snapshots: [action.snapshot, ...state.snapshots],
        user: {
          ...state.user,
          credits: Math.max(0, state.user.credits - 1),
        },
      }

    case 'SPEND_CREDITS':
      return {
        ...state,
        user: {
          ...state.user,
          credits: Math.max(0, state.user.credits - action.amount),
        },
      }

    case 'ADD_CREDITS':
      return {
        ...state,
        user: {
          ...state.user,
          credits: state.user.credits + action.amount,
        },
      }

    case 'CLEAR_HISTORY':
      return {
        ...state,
        evaluations: [],
        starredIds: new Set(),
      }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  // Persist on state change
  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useTab() {
  const { state, dispatch } = useApp()
  return {
    activeTab: state.activeTab,
    setTab: (tab) => dispatch({ type: 'SET_TAB', tab }),
  }
}

export function useEvaluations() {
  const { state, dispatch } = useApp()
  return {
    evaluations: state.evaluations,
    starredIds: state.starredIds,
    addEvaluation: (evaluation) => dispatch({ type: 'ADD_EVALUATION', evaluation }),
    toggleStar: (id) => dispatch({ type: 'TOGGLE_STAR', id }),
    isStarred: (id) => state.starredIds.has(id),
  }
}
