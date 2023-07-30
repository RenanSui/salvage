import { Toaster as RadToaster } from 'sonner'

export function Toaster() {
  return (
    <RadToaster
      position="top-left"
      toastOptions={{
        style: {
          background: '#6e6e6e3f',
          color: '#ccc',
          borderWidth: '1px',
          borderColor: '#ffffff2d',
          backdropFilter: 'blur(12px)',
          marginTop: 25,
          padding: 8,
        },
      }}
    />
  )
}
