import { useState, useRef, useCallback } from 'react'

/**
 * Custom hook to guard asynchronous actions against duplicate or rapid multi-clicks.
 * Guarantees that while an action is in-flight, subsequent clicks are completely ignored.
 *
 * @param {Function} asyncFn - The asynchronous function to execute
 * @returns {Array} [guardedAction, isProcessing]
 */
export function useSubmitGuard(asyncFn) {
  const [isProcessing, setIsProcessing] = useState(false)
  const isExecutingRef = useRef(false)

  const executeGuarded = useCallback(
    async (...args) => {
      // If already executing an action, immediately reject concurrent invocation
      if (isExecutingRef.current) {
        console.warn('[Submit Guard] Ignored duplicate rapid submission attempt.')
        return
      }

      isExecutingRef.current = true
      setIsProcessing(true)

      try {
        return await asyncFn(...args)
      } finally {
        isExecutingRef.current = false
        setIsProcessing(false)
      }
    },
    [asyncFn]
  )

  return [executeGuarded, isProcessing]
}
