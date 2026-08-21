import { AuthProvider, SearchPaletteProvider } from '@/contexts'
import { AppRouter } from '@/routes/AppRouter'
import { Toast } from '@/components/common'

function App() {
  return (
    <AuthProvider>
      <SearchPaletteProvider>
        <AppRouter />
        <Toast />
      </SearchPaletteProvider>
    </AuthProvider>
  )
}

export default App
