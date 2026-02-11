'use client'

import { useState } from 'react'
import { AuthApi } from '@/infrastructure/client/auth.api'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    try {
      const result = await AuthApi.signUp({ email, password })
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Pendaftaran gagal')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Terjadi kesalahan yang tidak terduga')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Pendaftaran Berhasil!
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Silakan cek email Anda untuk memverifikasi akun sebelum masuk.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex font-medium text-indigo-600 hover:text-indigo-500"
              >
                Kembali ke halaman Masuk
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Daftar Akun
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Buat akun baru untuk mulai melacak progres belajar Anda
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sudah punya akun? Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
