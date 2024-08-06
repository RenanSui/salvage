import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // data-theme="dark"
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'custom-color-500': 'hsl(var(--custom-color-100))',
        'custom-color-400': 'hsl(var(--custom-color-400))',
        'custom-color-300': 'hsl(var(--custom-color-300))',
        'custom-color-200': 'hsl(var(--custom-color-200))',
        'custom-color-100': 'hsl(var(--custom-color-100))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
  plugins: [],
}
export default config
