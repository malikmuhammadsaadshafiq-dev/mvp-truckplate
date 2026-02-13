'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cn(
      'fixed bottom-4 right-4 px-6 py-3 rounded-2xl shadow-lg animate-slide-in-right z-50 font-medium',
      type === 'success' && 'bg-green-500 text-white',
      type === 'error' && 'bg-red-500 text-white',
      type === 'info' && 'bg-blue-500 text-white'
    )}>
      {message}
    </div>
  )
}