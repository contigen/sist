import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function withTryCatch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.error(err)
    return null
  }
}

export function estimateTokenCount(text: string) {
  if (!text) return 0
  const words = text.trim().split(/\s+/).length
  const chars = text.length
  return Math.ceil((words + chars / 4) / 2)
}
