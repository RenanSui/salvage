import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const debounce = (func, timeout = 1000) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export const randomId = function (length = 50) {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  ).substring(0, length)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
