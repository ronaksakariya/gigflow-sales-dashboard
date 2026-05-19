import { useNavigate } from 'react-router-dom'
import { Zap, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(isSystemDark ? 'light' : 'dark')
    }
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(pref-color-scheme: dark)').matches)

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg supports-backdrop-filter:backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
            <Zap className="size-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">GigFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <div className="hidden sm:flex items-center gap-2.5 pl-1">
            <div className="flex items-center justify-center size-8 rounded-full bg-muted font-semibold text-xs text-muted-foreground border border-border">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user?.name}</span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">{user?.email}</span>
            </div>
          </div>
          <Badge variant={user?.role === 'admin' ? 'destructive' : 'secondary'} className="hidden sm:inline-flex capitalize">
            {user?.role}
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}