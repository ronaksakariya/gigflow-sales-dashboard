import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Zap, BarChart3, Users, ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const BRAND_BG_PATTERN =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNjBWMGw2MCAzMEwwIDYwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4="

const GRID_BG_PATTERN =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4="

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    try {
      await login(data.email, data.password)
      navigate("/dashboard")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Login failed")
      } else {
        setError("Login failed")
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-col overflow-hidden bg-linear-to-br from-indigo-500 via-blue-600 to-violet-700 text-white lg:flex lg:w-1/2">
        <div
          className={`absolute inset-0 opacity-50 bg-[url('${BRAND_BG_PATTERN}')]`}
        />
        <div className="relative z-10 flex h-full flex-col px-12 py-8">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-md">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GigFlow</span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="max-w-md text-4xl leading-tight font-bold">
              Turn leads into revenue with smarter pipelines
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/80">
              Track, qualify, and close deals faster with the modern CRM built
              for sales teams that move fast.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                  <BarChart3 className="size-5" />
                </div>
                <span className="text-xs text-white/70">Analytics</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                  <Users className="size-5" />
                </div>
                <span className="text-xs text-white/70">Collaboration</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                  <Zap className="size-5" />
                </div>
                <span className="text-xs text-white/70">Automation</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/60">© 2026 GigFlow Inc.</p>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className={`absolute inset-0 bg-[url('${GRID_BG_PATTERN}')]`} />
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="size-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">GigFlow</span>
          </div>
          <Card className="border border-border/60 bg-white shadow-xl shadow-black/4 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 bg-slate-50 dark:bg-slate-800/50"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-medium">
                      Password
                    </Label>
                    <span className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-primary">
                      Forgot?
                    </span>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 bg-slate-50 dark:bg-slate-800/50"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="h-11 w-full shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Sign In
                  {!isSubmitting && <ArrowRight className="ml-1 size-4" />}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center rounded-b-xl border-t bg-slate-50/50 dark:bg-slate-800/30">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary transition-colors hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
