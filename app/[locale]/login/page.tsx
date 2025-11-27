'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button' // Wir erstellen das gleich
import { Input } from '@/components/ui/input'    // Wir erstellen das gleich

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      alert('Fehler: ' + error.message)
    } else {
      alert('Check deine E-Mail für den Magic Link!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TankSitter</h1>
          <p className="text-gray-600">Dein Aquarium-Sitter Guide</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="E-Mail Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sendet...' : 'Magic Link senden'}
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 text-center">
          Kein Passwort. Einfach auf den Link in deiner E-Mail klicken.
        </p>
      </div>
    </div>
  )
}
