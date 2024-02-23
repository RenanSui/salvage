import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const longestCommonStartingSubstring = (arr1: string[]): string => {
  // Create a sorted copy of the input array
  const arr = arr1.concat().sort()
  // Get the first and last strings after sorting
  const a1 = arr[0]
  const a2 = arr[arr.length - 1]
  // Get the length of the first string
  const L = a1.length
  // Initialize an index variable
  let i = 0

  // Iterate through the characters of the first string until a mismatch is found
  while (i < L && a1.charAt(i) === a2.charAt(i)) {
    i++
  }

  // Return the longest common starting substring using substring(0, i)
  return a1.substring(0, i)
}
