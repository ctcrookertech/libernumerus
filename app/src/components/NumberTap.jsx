import { useState, useCallback } from 'react'
import { C, fonts } from '../utils/theme'
import QuickMeaning from './QuickMeaning'

/**
 * NumberTap — wraps any number display to make it tappable (DrillDown)
 * and long-pressable (QuickMeaning).
 */
export default function NumberTap({ number, children, onTap, style }) {
  const [pressed, setPressed] = useState(false)
  const [quickMeaning, setQuickMeaning] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState(null)

  const handlePointerDown = useCallback(() => {
    setPressed(true)
    const timer = setTimeout(() => {
      setQuickMeaning(true)
      setPressed(false)
    }, 500) // 500ms long press
    setLongPressTimer(timer)
  }, [])

  const handlePointerUp = useCallback(() => {
    setPressed(false)
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }, [longPressTimer])

  const handleClick = useCallback(() => {
    if (!quickMeaning) {
      onTap?.()
    }
  }, [quickMeaning, onTap])

  return (
    <>
      <span
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          transform: pressed ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.1s',
          userSelect: 'none',
          ...style,
        }}
      >
        {children || (
          <span style={{
            fontFamily: fonts.mono,
            color: C.textBright,
          }}>
            {number}
          </span>
        )}
      </span>

      {quickMeaning && typeof number === 'number' && (
        <QuickMeaning
          number={number}
          onClose={() => setQuickMeaning(false)}
        />
      )}
    </>
  )
}
